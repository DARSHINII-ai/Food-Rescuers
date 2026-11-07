🍃 FoodBridge – Bridging Food Surplus to Those in Need

Good food shouldn't end up in the bin.

FoodBridge is a food redistribution platform designed to reduce food waste by connecting restaurants, hotels, event organizers, and households with NGOs and people in need.

The platform aims to make surplus food donation easier, faster, and more accessible while promoting sustainability and community welfare.

🌍 Problem Statement

Large quantities of perfectly edible food are wasted every day by restaurants, hotels, events, and households, while many people struggle to access nutritious meals.

FoodBridge aims to bridge this gap by creating a platform where surplus food can reach those who need it instead of going to waste.

💡 Key Features

- Food Donation: Enables food donors to contribute surplus food.
- Food Redistribution: Helps connect food donors with NGOs and communities in need.
- Community Impact: Encourages people to participate in reducing food waste.
- Interactive Mindmap: Visualizes the food rescue journey and its impact.
- Responsive Interface: Designed to provide a smooth experience across devices.
- Supabase Integration: Supports backend connectivity and data management.

🛠️ Tech Stack

Technology| Purpose
HTML| Webpage structure
CSS| Styling and responsive design
JavaScript| Interactive functionality and animations
Vite| Development and build tool
Supabase| Backend and database services

📁 Project Structure

FoodBridge/
├── src/
│   ├── main.js
│   ├── styles.css
│   ├── supabase.js
│   ├── grain-field.js
│   ├── mindmap.js
│   ├── motion.js
│   ├── pledge.js
│   └── sound.js
├── supabase/
│   └── migrations/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── .gitignore

🚀 Getting Started

1. Clone the repository

git clone https://github.com/DARSHINI11-ai/Food-Rescuers.git

2. Navigate to the project directory

cd Food-Rescuers

3. Install dependencies

npm install

4. Configure environment variables

Create a ".env" file in the root directory:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

Replace the placeholders with your Supabase project details.

5. Run the development server

npm run dev

Open the local URL displayed in your terminal to view the website.

6. Build for production

npm run build

🔐 Environment Variables

Environment variables are used to configure the Supabase connection.

Important: Never commit your ".env" file or private service-role keys to GitHub. The Supabase client key used in browser applications should be protected by appropriate Row Level Security (RLS) policies.

🌱 Our Mission

FoodBridge believes that food is too valuable to waste. By connecting surplus food with communities that need it, we aim to create a more sustainable and compassionate future.

Save Food. Share Hope. Build a Better Tomorrow.

---

Developed with 💚 for a better and more sustainable world.
