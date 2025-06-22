# Livesite
![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-007acc.svg)

![Livesite](https://socialify.git.ci/pulkitgarg04/livesite/image?font=Raleway&language=1&name=1&owner=1&stargazers=1&theme=Auto)

A simple web application that allows users to edit, update, and preview HTML, CSS, and JavaScript code. This project is built with Next.js and provides a user-friendly interface for managing site details, such as title, slug, description, and code content.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (version >= 14.x)
- MongoDB instance (or MongoDB Atlas for cloud-based databases)

### Clone the Repository

```bash
git clone https://github.com/pulkitgarg04/livesite.git
cd livesite
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
Create a .env.local file in the root of the project and add the following:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
MONGODB_URI
NODE_ENV
```

### Run the Application Locally
```bash
npm run dev
```

Your site should now be running on http://localhost:3000.

--- 
## Contributions
Contributions are welcome! Feel free to fork the repository, submit issues, and create pull requests. Please ensure to follow the code of conduct and best practices while contributing.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.