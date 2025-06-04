// Environment Variable Injection for Production
// This script injects environment variables into the client-side code for Vercel deployment

const fs = require("fs");
const path = require("path");

function injectEnvironmentVariables() {
  // Read the index.html file
  const indexPath = path.join(__dirname, "index.html");
  let indexContent = fs.readFileSync(indexPath, "utf8");

  // Create environment variable injection script
  const envScript = `
    <script>
      // Inject environment variables for client-side access
      window.NEXT_PUBLIC_GOOGLE_MAPS_API = "${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API ||
        "AIzaSyDkzk56s1ckzP9PTJuwrljKjm3lf0wTdKk"
      }";
      window.NEXT_PUBLIC_OPENWEATHER_API = "${
        process.env.NEXT_PUBLIC_OPENWEATHER_API ||
        "1afe1e1e1631043e38006919de2c1b3b"
      }";
    </script>
  `;

  // Inject the script before the closing head tag
  indexContent = indexContent.replace("</head>", `${envScript}\n  </head>`);

  // Write the modified content back
  fs.writeFileSync(indexPath, indexContent);

  console.log("✅ Environment variables injected successfully");
}

// Run if this script is executed directly
if (require.main === module) {
  injectEnvironmentVariables();
}

module.exports = { injectEnvironmentVariables };
