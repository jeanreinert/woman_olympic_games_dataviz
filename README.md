# Women's Olympic Revolution - Data Storytelling

See https://jeanreinert.github.io/woman_olympic_games_dataviz/

## Overview
This project is an interactive data visualization and storytelling web application that explores the evolution and impact of female participation in the Olympic Games from 1896 to 2016. It highlights how women overcame early prohibitions, broke records, and transformed the performance of nations on the world's biggest sporting stage.

## Features

The application is structured into several interactive sections designed to guide the user through different aspects of Olympic history:

*   **Interactive Timeline:** Tracks the historical evolution of female participation. Users can toggle between the proportion of female athletes, total number of athletes, and the number of modalities over 120 years.
*   **Global Map & Geopolitics:** A world map visualization showing the percentage of medals won by women for each country, illustrating the geopolitical impact of female athletes on national medal counts.
*   **Side-by-Side Comparator:** An analytical tool allowing users to select two different countries and directly compare the impact and performance of their female Olympic teams.
*   **Biometrics & Physical Evolution:** Data visualization showing how the average physical profile (age, height, and weight) of female athletes has transformed across decades due to professionalization and sports science.
*   **Hall of Fame:** A searchable gallery of Olympic legends, featuring the most victorious female athletes in the history of the Games with detailed modal popups.

## Data Sources

The visualizations and storytelling insights are derived from historical Olympic datasets (spanning from 1896 to 2016) available at https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results

## Technology Stack

This project is built using standard web technologies with a focus on modern, glassmorphism-inspired UI components:

*   **HTML5 / CSS3:** Using custom styling with modular CSS files (main, timeline, map, components).
*   **JavaScript (ES Modules):** Vanilla JS for handling interactive logic, state, and UI updates.
*   **Chart.js:** Utilized for rendering the interactive charts (Timeline and Biometrics).
*   **Lucide Icons:** For clean, scalable vector icons.
*   **Google Fonts:** Outfit and Plus Jakarta Sans for typography.

## Setup and Installation

Since this is a client-side web application using ES Modules, it needs to be served via a local web server to function correctly and avoid CORS issues when loading local resources.

1. Clone the repository to your local machine.
2. Open your terminal and navigate to the project directory.
3. Start a local development server. For example, if you have Python installed, you can run:
   `python -m http.server 8000`
   Alternatively, you can use Node.js tools like `live-server` or the VS Code Live Server extension.
4. Open your web browser and navigate to `http://localhost:8000`.

## Project Structure

*   `index.html`: The main entry point of the application.
*   `/styles/`: Directory containing modular CSS files.
*   `/scripts/`: Directory containing JavaScript ES modules (`app.js` and dependencies).
*   `/data/`: (Assumed) Directory containing the source CSV files.
