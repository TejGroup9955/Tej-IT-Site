📂 Project Folder Structure (Summary)

Tej-IT-Site/
│
├── backend/                 # Python (Flask?) backend app
│   ├── app.py               # Main backend entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   ├── knowledge_base.py    # Custom backend module
│   ├── flask_session/       # Session storage files
│   ├── templates/           # HTML templates (Jinja2)
│   │   ├── blogs_list.html
│   │   ├── dashboard.html
│   │   ├── login.html
│   │   └── ...
│   ├── static/              # Static assets for backend
│   │   ├── css/
│   │   ├── icons/
│   │   └── uploads/
│   └── export_backend.sh    # Deployment/export script?
│
├── frontend/                # Next.js (TypeScript) frontend app
│   ├── app/                 # Next.js 13+ "App Router"
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── ...
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ChatWidget.tsx
│   ├── public/              # Public static assets
│   │   ├── blogs/
│   │   ├── about/
│   │   ├── erp/
│   │   ├── client-logo/
│   │   ├── chatbot/
│   │   └── ...
│   ├── styles/ (globals in app/globals.css, Tailwind config)
│   ├── next.config.ts       # Next.js configuration
│   ├── package.json         # Frontend dependencies
│   ├── tsconfig.json        # TypeScript config
│   └── tailwind.config.ts   # Tailwind setup
│
├── readme.md                # Root project readme
└── (possibly CI/CD files later)

🔹 Tech Stack Identified

Frontend: Next.js (TypeScript, App Router, TailwindCSS)

Backend: Python Flask (Jinja2 templates + static serving)

Session Handling: Flask-Session (files in flask_session/)

Static Assets:

Frontend assets in frontend/public/

Backend assets in backend/static/

Environment Config: .env in backend

🔹 Deployment Implications

Frontend (Next.js):

If you need Server-Side Rendering (SSR) → Deploy as a Node.js service (Elastic Beanstalk Node.js or Docker).

If you only need Static Export → Run next build && next export → Deploy to S3 + CloudFront.

Backend (Flask):

Deploy as a Python Elastic Beanstalk environment (Gunicorn + Flask).

Needs .env values in EB environment variables.

Integration:

Frontend calls APIs from Flask backend via EB URL / Load Balancer.

For production → put CloudFront in front of both (frontend & backend as origins).
To run backend

cd backend/
python3 -m venv/venv
source venv/bin/activate
python app.py

To run frontend
cd frontend 
npm install
npm run dev / npm run build


update Our History remove 2008 to 2014 and 
keep 2015 to 2016 & 2016 to 2018 
new add history 2018 to 2022 & 2022 to present 
remove all old images from the website 
remove class management product 

update modern UI for blogs, and careers page 
implement meta tags, metadata for website ranking 


open router api key :- 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