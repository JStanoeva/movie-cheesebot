        const chatWindow = document.getElementById('chat-window');
        const movieInput = document.getElementById('movie-input');
        const sendButton = document.getElementById('send-button');

        // IMPORTANT: Replace with your actual OMDb API key if needed.
        // For this demonstration, Queen Tora's key is used.
        // In a real production app, API keys should NOT be exposed in client-side code.
        // They should be handled by a backend server.
        const apiKey = '24feda60'; 

        let isCheeseModeActive = localStorage.getItem('cheeseMode') === 'true'; // Load cheese mode state
        const cheeseTriggers = ["dY\u0015?", "\uD83E\uDDC0"]; // Support legacy and emoji triggers

        // Initial greeting from the bot
        function initialGreeting() {
            addBotMessage("Greetings, Your Royal Cheesiness! 👑 I'm your personal movie maître d'. What cinematic delight are we slicing into today? Or perhaps you'd like to activate a *special* cheesy feature? 😉");
        }

        function addMessageToChat(message, sender) {
            const bubble = document.createElement('div');
            bubble.classList.add('chat-bubble');
            if (sender === 'user') {
                bubble.classList.add('user-bubble');
                bubble.textContent = message;
            } else if (sender === 'bot-error') {
                bubble.classList.add('bot-bubble', 'error');
                bubble.innerHTML = message; // Use innerHTML for bot messages that might contain HTML
            }
            else { // bot
                bubble.classList.add('bot-bubble');
                bubble.innerHTML = message; // Use innerHTML for bot messages that might contain HTML
            }
            chatWindow.appendChild(bubble);
            chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
        }

        function addUserMessage(message) {
            addMessageToChat(message, 'user');
        }

        function addBotMessage(message) {
            // Add a little "typing" delay for realism
            setTimeout(() => {
                addMessageToChat(message, 'bot');
            }, 500);
        }
        
        function addBotErrorMessage(message) {
             setTimeout(() => {
                addMessageToChat(message, 'bot-error');
            }, 500);
        }


        async function fetchMovieData(movieTitle) {
            addBotMessage("On it, Your Majesty! 🕵️‍♂️ Searching the great cheese wheel of cinema for '" + movieTitle + "'...");
            try {
                const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}`);
                const data = await response.json();

                if (data.Response === "True") {
                    displayMovieInfo(data);
                } else {
                    addBotErrorMessage(`Oh crumbs! 😥 It seems "${movieTitle}" has crumbled from my grasp. "${data.Error || 'Movie not found!'}" Perhaps another selection from the cheese board of films?`);
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
                addBotErrorMessage("Uh oh! My wires got a bit tangled trying to fetch that. It's not very *gouda*. Please try again!");
            }
        }

        function displayMovieInfo(movie) {
            const titlePrefix = isCheeseModeActive ? "🧀 " : "";
            let ratingsHTML = movie.Ratings && movie.Ratings.length > 0 ? 
                movie.Ratings.map(rating => `<p><strong>${rating.Source}:</strong> ${rating.Value}</p>`).join('') :
                (movie.imdbRating && movie.imdbRating !== "N/A" ? `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>` : '<p>No ratings available.</p>');

            if (movie.imdbRating && movie.imdbRating !== "N/A" && !movie.Ratings.find(r => r.Source === "Internet Movie Database")) {
                 ratingsHTML += `<p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>`;
            }


            const movieCardHTML = `
                <div class="movie-card">
                    <h2 class="movie-title">${titlePrefix}${movie.Title}</h2>
                    <div class="movie-details">
                        <p><strong>Released:</strong> ${movie.Year || 'N/A'}</p>
                        <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
                        <p><strong>Plot:</strong> ${movie.Plot || 'N/A'}</p>
                        <h3 class="font-semibold mt-3 mb-1 text-amber-700">Ratings:</h3>
                        ${ratingsHTML}
                        <p class="mt-2"><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
                        <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
                        ${movie.Poster && movie.Poster !== "N/A" ? `<img src="${movie.Poster}" alt="Poster for ${movie.Title}" class="mt-4" onerror="this.style.display='none'">` : ''}
                    </div>
                </div>
            `;
            addBotMessage("Aha! A *gouda* find! Here's the scoop on " + movie.Title + ":" + movieCardHTML);
        }

        function handleUserInput() {
            const userInput = movieInput.value.trim();
            if (!userInput) return;

            addUserMessage(userInput);
            movieInput.value = ''; // Clear input field

            if (cheeseTriggers.includes(userInput)) {
                isCheeseModeActive = !isCheeseModeActive;
                localStorage.setItem('cheeseMode', isCheeseModeActive); // Save cheese mode state
                if (isCheeseModeActive) {
                    addBotMessage("Huzzah! 🥳 You've activated **SUPER CHEESE MODE**! All movie titles will now be extra cheesy! It's gonna be *brie-lliant*!");
                } else {
                    addBotMessage("Super Cheese Mode deactivated. We're back to regular, still very delightful, movie searching. Still *fondue-tastic*!");
                }
            } else {
                fetchMovieData(userInput);
            }
        }

        sendButton.addEventListener('click', handleUserInput);
        movieInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleUserInput();
            }
        });

        // Display initial greeting when the page loads
        initialGreeting();
