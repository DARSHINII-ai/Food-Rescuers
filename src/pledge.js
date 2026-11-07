import { gsap } from 'gsap';
import { supabase } from './supabase.js';

const GOAL = 10000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TYPE_LABELS = {
  donate: 'donating food',
  volunteer: 'volunteering',
  partner: 'partnering as an NGO',
};

const readForm = (form) => {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
    pledgeType: String(data.get('pledge_type') ?? ''),
  };
};

const validate = ({ name, email }) => {
  const errors = {};
  if (name.length < 1 || name.length > 80) errors.name = 'Please enter your name.';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';
  return errors;
};

export function initPledge({ sound }) {
  const form = document.getElementById('pledge-form');
  const submit = document.getElementById('pledge-submit');
  const submitText = submit.querySelector('.btn-text');
  const status = document.getElementById('form-status');
  const totalEl = document.getElementById('total-pledges');
  const goalFill = document.getElementById('goal-fill');
  const goalText = document.getElementById('goal-text');

  const showStatus = (message, kind) => {
    status.textContent = message;
    status.className = `form-status${kind ? ` is-${kind}` : ''}`;
  };

  const renderTotal = (total) => {
    const shown = { value: Number(totalEl.textContent.replace(/,/g, '')) || 0 };
    gsap.to(shown, {
      value: total,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => {
        totalEl.textContent = Math.round(shown.value).toLocaleString('en-US');
      },
    });
    gsap.to(goalFill, {
      scaleX: Math.min(total / GOAL, 1),
      duration: 1.6,
      ease: 'power3.out',
    });
    goalText.textContent = `${Math.round((total / GOAL) * 100)}% of our goal of ${GOAL.toLocaleString('en-US')} pledges`;
  };

  const loadTotals = async () => {
    const { data, error } = await supabase.rpc('get_pledge_counts');
    if (error || !Array.isArray(data)) {
      goalText.textContent = 'Live totals are taking a moment to load.';
      return;
    }
    renderTotal(data.reduce((sum, row) => sum + Number(row.total), 0));
  };

  const setSubmitting = (busy) => {
    submit.disabled = busy;
    submitText.textContent = busy ? 'Sending your pledge...' : 'Join FoodBridge';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = readForm(form);
    const errors = validate(values);

    form.querySelectorAll('input[name="name"], input[name="email"]').forEach((input) => {
      input.classList.toggle('invalid', Boolean(errors[input.name]));
    });
    const firstError = Object.values(errors)[0];
    if (firstError) {
      showStatus(firstError, 'error');
      return;
    }

    setSubmitting(true);
    showStatus('', '');
    const { error } = await supabase.from('pledges').insert({
      name: values.name,
      email: values.email,
      pledge_type: values.pledgeType,
    });
    setSubmitting(false);

    if (error) {
      showStatus('We could not save your pledge just now. Please try again in a moment.', 'error');
      return;
    }

    const firstName = values.name.split(' ')[0];
    showStatus(`Welcome to the circle, ${firstName}. Thank you for ${TYPE_LABELS[values.pledgeType]}.`, 'success');
    sound.chime();
    form.reset();
    loadTotals();
  });

  loadTotals();
}
