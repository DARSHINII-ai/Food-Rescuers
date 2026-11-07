import './styles.css';
import { initGrainField } from './grain-field.js';
import { initMotion } from './motion.js';
import { initPledge } from './pledge.js';
import { createSoundEngine } from './sound.js';

const sound = createSoundEngine();
const soundToggle = document.getElementById('sound-toggle');
const soundLabel = soundToggle.querySelector('.sound-label');

const renderSoundToggle = () => {
  const on = sound.isEnabled();
  soundToggle.setAttribute('aria-pressed', String(on));
  soundLabel.textContent = on ? 'Sound on' : 'Sound off';
};

soundToggle.addEventListener('click', () => {
  sound.setEnabled(!sound.isEnabled());
  renderSoundToggle();
  sound.chime();
});
renderSoundToggle();

initGrainField(document.getElementById('grain-field'));
initMotion({ sound });
initPledge({ sound });
