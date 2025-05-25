import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import veggiesImage from '/veggies.jpg';
import SearchBar from './SearchBar';
import CategoryBox from './CategoryBox';
import { motion, AnimatePresence } from "framer-motion";
import Popup from './Popup';
import RemoveButton from './RemoveButton';
import UserButton from './UserButton';
import LoginForm from './LoginForm';
import UserDashboard from './UserDashboard';
import Login from './Login';
import RegisterForm from './RegisterForm';
import BackButton from './BackButton';
import { ingredientsByCategory } from './constants/ingredients';
import { apiService } from './services/apiService';
import { useLocalStorage } from './hooks/useLocalStorage';

// Constants
const POPUP_DURATION = 1000;
const API_BASE_URL = "http://localhost:5000";
const RECIPES_PER_LOAD = 5;

// Custom hooks
const usePopup = (duration = POPUP_DURATION) => {
    const [showPopup, setShowPopup] = useState(false);
    const timeoutRef = useRef(null);

    const triggerPopup = useCallback(() => {
        setShowPopup(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setShowPopup(false);
        }, duration);
    }, [duration]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return { showPopup, triggerPopup };
};

const useRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreRecipes, setHasMoreRecipes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [currentIngredients, setCurrentIngredients] = useState();

    const fetchInitialRecipes = useCallback(async (ingredients) => {
        if (!ingredients.length) {
            setRecipes([]);
            setCurrentPage(1);
            setHasMoreRecipes(false);
            setCurrentIngredients([]);
            return;
        }

        setLoading(true);
        setError(null);
        setCurrentIngredients(ingredients);
        setCurrentPage(1);

        try {
            // Get first page of recipes from backend
            const response = await fetch(`${API_BASE_URL}/generate-recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: ingredients.join(','),
                    page: 1,
                    per_page: RECIPES_PER_LOAD
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }

            const data = await response.json();

            if (data['recipe-ids']) {
                const recipeData = await apiService.getRecipeLinks(data['recipe-ids']);
                setRecipes(recipeData);
                setHasMoreRecipes(data.has_more || false);
            }
        } catch (err) {
            setError('Failed to fetch recipes. Please try again.');
            console.error('Recipe fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMoreRecipes = useCallback(async () => {
        if (!hasMoreRecipes || !currentIngredients.length) return;

        setLoadingMore(true);
        setError(null);

        try {
            const nextPage = currentPage + 1;

            const response = await fetch(`${API_BASE_URL}/generate-recipes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: currentIngredients.join(','),
                    page: nextPage,
                    per_page: RECIPES_PER_LOAD
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch more recipes');
            }

            const data = await response.json();

            if (data['recipe-ids']) {
                const moreRecipeData = await apiService.getRecipeLinks(data['recipe-ids']);
                setRecipes(prev => [...prev, ...moreRecipeData]);
                setHasMoreRecipes(data.has_more || false);
                setCurrentPage(nextPage);
            }
        } catch (err) {
            setError('Failed to load more recipes. Please try again.');
            console.error('Load more recipes error:', err);
        } finally {
            setLoadingMore(false);
        }
    }, [currentIngredients, currentPage, hasMoreRecipes]);

    return {
        recipes,
        loading,
        loadingMore,
        error,
        hasMoreRecipes,
        fetchRecipes: fetchInitialRecipes,
        loadMoreRecipes
    };
};

// Custom hook for favorites management
const useFavorites = (userId, token) => {
    const [favorites, setFavorites] = useState([]);
  
    // Load favorites from backend on mount or when userId/token changes
    useEffect(() => {
      if (!userId || !token) {
        // No user logged in, fallback to localStorage
        try {
          const saved = localStorage.getItem('favoriteRecipes');
          setFavorites(saved ? JSON.parse(saved) : []);
        } catch {
          setFavorites([]);
        }
        return;
      }
  
      // Fetch favorites from backend
      fetch(`/api/favorite-recipes?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch favorites");
          return res.json();
        })
        .then(data => {
          if (data.recipes && data.recipes.length > 0) {
            setFavorites(data.recipes);
            localStorage.setItem('favoriteRecipes', JSON.stringify(data.recipes)); // keep localStorage in sync
          } else {
            // fallback to localStorage if backend is empty
            const saved = localStorage.getItem('favoriteRecipes');
            setFavorites(saved ? JSON.parse(saved) : []);
          }
        })
        .catch(() => {
          // On error fallback to localStorage
          try {
            const saved = localStorage.getItem('favoriteRecipes');
            setFavorites(saved ? JSON.parse(saved) : []);
          } catch {
            setFavorites([]);
          }
        });
    }, [userId, token]);
  
    // Save to backend and localStorage when adding favorite
    const addToFavorites = useCallback((recipe) => {
      setFavorites(prev => {
        if (prev.some(fav => fav.id === recipe.id)) return prev;
  
        const updated = [...prev, { ...recipe, dateAdded: new Date().toISOString() }];
  
        // Update backend
        if (userId && token) {
          fetch('/api/favorite-recipes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: userId, ...recipe })
          }).catch(console.error);
        }
  
        localStorage.setItem('favoriteRecipes', JSON.stringify(updated));
        return updated;
      });
    }, [userId, token]);
  
    // Remove from backend and localStorage
    const removeFromFavorites = useCallback((recipeId) => {
      setFavorites(prev => {
        const updated = prev.filter(fav => fav.id !== recipeId);
  
        if (userId && token) {
          fetch(`/api/favorite-recipes/${recipeId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          }).catch(console.error);
        }
  
        localStorage.setItem('favoriteRecipes', JSON.stringify(updated));
        return updated;
      });
    }, [userId, token]);
  
    const isFavorite = useCallback((recipeId) => {
      return favorites.some(fav => fav.id === recipeId);
    }, [favorites]);
  
    const clearAllFavorites = useCallback(() => {
      setFavorites([]);
      localStorage.removeItem('favoriteRecipes');
  
      if (userId && token) {
        fetch(`/api/favorite-recipes/clear`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }).catch(console.error);
      }
    }, [userId, token]);
  
    return {
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      clearAllFavorites
    };
  };

function RecipeFinder() {
    // State management
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        try {
            const saved = localStorage.getItem('savedIngredients');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('savedIngredients', JSON.stringify(selectedIngredients));
    }, [selectedIngredients]);


    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [lastSelectedIngredient, setLastSelectedIngredient] = useState(null);
    const [userTab, setUserTab] = useState(false);
    const [user, setUser] = useState(null);
    const [showRegister, setShowRegister] = useState(false);
    const [currentView, setCurrentView] = useState('recipes'); // 'recipes' or 'favorites'

    // Custom hooks
    const { showPopup, triggerPopup } = usePopup();
    const {
        recipes,
        loading,
        loadingMore,
        error,
        hasMoreRecipes,
        fetchRecipes,
        loadMoreRecipes
    } = useRecipes();
    const { favorites, addToFavorites, removeFromFavorites, isFavorite, clearAllFavorites } = useFavorites();

    // Memoized values
    const hasSelectedIngredients = useMemo(() =>
        selectedIngredients.length > 0, [selectedIngredients.length]
    );

    const popupMessage = useMemo(() => {
        if (!hasSelectedIngredients) return "trash";
        return lastSelectedIngredient;
    }, [hasSelectedIngredients, lastSelectedIngredient]);

    // Event handlers
    const clearAllIngredients = useCallback(() => {
        setSelectedIngredients([]);
        setQuery("");
        setShowSuggestions(false);
        triggerPopup();
    }, [triggerPopup]);

    const handleIngredientChange = useCallback((ingredient) => {
        setSelectedIngredients((prevState) => {
            const isRemoving = prevState.includes(ingredient);
            const updatedIngredients = isRemoving
                ? prevState.filter(item => item !== ingredient)
                : [...prevState, ingredient];

            setLastSelectedIngredient({
                ingredientName: ingredient,
                action: isRemoving ? 'removed' : 'added'
            });

            triggerPopup();
            return updatedIngredients;
        });
    }, [triggerPopup]);

    const handleGenerateRecipes = useCallback(() => {
        fetchRecipes(selectedIngredients);
        setCurrentView('recipes');
    }, [fetchRecipes, selectedIngredients]);

    const handleLogout = useCallback(() => {
        setUser(null);
        setUserTab(false);
    }, []);

    const handleFavoriteToggle = useCallback((recipe) => {
        if (isFavorite(recipe.id)) {
            removeFromFavorites(recipe.id);
        } else {
            addToFavorites(recipe);
        }
    }, [isFavorite, removeFromFavorites, addToFavorites]);

    // Render functions
    const renderHeader = () => (
        <div className="mb-6">
            <div className='flex justify-between items-center gap-4'>
                <div className='flex items-center gap-2'>
                    <span className="text-lg font-medium">what's in my fridge?</span>
                </div>
                <button
                    onClick={handleGenerateRecipes}
                    disabled={!hasSelectedIngredients || loading}
                    className="bg-blue-300 text-white pl-2 pr-2 pt-1 pb-1 rounded-md hover:bg-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                >
                    {loading ? 'generating' : 'search for recipes'}
                </button>
                <div className='flex items-center gap-2'>
                    {renderFavoriteButton()}
                    <div className="bg-gray-300 h-4 w-px"></div>
                    <UserButton onClick={() => setUserTab(true)} />
                </div>
            </div>
            <div className="bg-gray-300 h-px w-full mt-4"></div>
        </div>
    );

    const renderUserSection = () => {
        if (!userTab) return null;

        return (
            <div className="space-y-4">
                <BackButton onClick={() => { setUserTab(false); setCurrentView('recipes') }} />
                {user ? (
                    <UserDashboard user={user} onLogout={handleLogout} />
                ) : (
                    <div className="max-w-md mx-auto">
                        {showRegister ? (
                            <RegisterForm onRegister={() => setShowRegister(false)} />
                        ) : (
                            <LoginForm onLogin={setUser} />
                        )}
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowRegister(!showRegister)}
                                className="text-red-400 hover:text-red-800 transition-colors font-semibold"
                            > or
                                {showRegister ? ' sign in' : ' sign up'}
                            </button>
                        </div>
                        <div className="mt-6 text-center flex justify-center">
                            <Login />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRecipeCard = (recipe, index) => (
        <motion.div
            key={recipe.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden relative"
        >
            {/* Favorite button */}
            <button
                onClick={() => handleFavoriteToggle(recipe)}
                className="absolute top-3 right-3 z-10 p-1 rounded-full"
            >
                <svg
                    className={`w-5 h-5 ${isFavorite(recipe.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    fill={isFavorite(recipe.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            </button>
    
            {/* Image */}
            <div className="h-22 w-full bg-cover bg-center" style={{ backgroundImage: `url(${recipe.image})` }} />
    
            {/* Info section */}
            <div className="p-4">
                <h3 className="text-gray-800 text-base md:text-lg line-clamp-2">
                    {recipe.title || <span className="text-gray-400 italic">Untitled Recipe</span>}
                </h3>
                <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-800 text-sm"
                >
                    view recipe →
                </a>
            </div>
        </motion.div>
    );
    
    

    const renderFavorites = () => {
        return (
            <>
                <div className="col-span-full mb-4">
                    <BackButton onClick={() => setCurrentView('recipes')} />
                </div>
                {favorites.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-96    ">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-2">No favorite recipes yet</p>
                        <p className="text-gray-400 text-sm">Start adding recipes to your favorites to see them here!</p>
                    </div>
                ) : (
                    <>
                        <div className="col-span-full flex justify-between items-center mb-4">
                            <button
                                onClick={clearAllFavorites}
                                className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                        {favorites.map((recipe, index) => renderRecipeCard(recipe, index))}
                    </>
                )}
            </>
        );
    };

    const renderRecipes = () => {
        if (userTab) return null;

        if (currentView === 'favorites') {
            return renderFavorites();
        }

        if (loading) {
            return (
                <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto flex justify-center"></div>
                    <p className="mt-2 text-gray-500">loading...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="col-span-full text-center py-8">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={handleGenerateRecipes}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        if (recipes.length === 0) {
            return (
                <p className="col-span-full text-center text-gray-500 py-8">
                    select the ingredients you have, then press the button above
                </p>
            );
        }

        return (
            <>
                {recipes.map((recipe, index) => renderRecipeCard(recipe, index))}
                {hasMoreRecipes && (
                    <div className="col-span-full flex justify-center mt-6">
                        <button
                            onClick={loadMoreRecipes}
                            disabled={loadingMore}
                            className="px-6 py-3 text-gray-500 rounded-lg hover:text-gray-700 disabled:cursor-not-allowed transition-colors duration-300 flex items-center gap-2"
                        >
                            {loadingMore ? (
                                <>
                                    <div className=""></div>
                                    loading more...
                                </>
                            ) : (
                                'view more'
                            )}
                        </button>
                    </div>
                )}
            </>
        );
    };

    const renderFavoriteButton = () => {
        const favCount = favorites.length;
        const isActive = currentView === 'favorites';

        return (
            <motion.button
                onClick={() => { setCurrentView('favorites'); setUserTab(false) }}
                className="transition duration-300 transform flex items-center rounded-lg hover:bg-gray-100 text-gray-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 0.9 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.01 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
            >
                <span className="text-sm font-medium">
                    favorites {favCount > 0 && `(${favCount})`}
                </span>
            </motion.button>
        );
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#EADBDD] font-sans p-2">
            <div className="w-full max-w-none bg-white shadow-xl rounded-xl" style={{
                width: '95vw',
                height: '95vh',
                minWidth: '320px',
                minHeight: '500px'
            }}>
                <div className="flex h-full p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 ">
                    <div className="overflow-y-auto rounded-2xl">
                        {/* Left Sidebar */}
                        <aside
                            className="flex relative bg-center"
                            style={{
                                backgroundImage: `url(${veggiesImage})`,
                                width: 'clamp(200px, 25vw, 320px)', minWidth: '200px'
                            }}
                        >
                            <div className="absolute inset-0 bg-black opacity-10" />
                            <div className="absolute inset-0 backdrop-blur-sm" />

                            <div className="relative z-10 h-full flex flex-col p-3 space-y-4">
                                <div className="flex items-center gap-2">
                                    <SearchBar
                                        query={query}
                                        setQuery={setQuery}
                                        showSuggestions={showSuggestions}
                                        setShowSuggestions={setShowSuggestions}
                                        onSelect={handleIngredientChange}
                                        selectedIngredients={selectedIngredients}
                                    />
                                    <RemoveButton
                                        onClick={clearAllIngredients}
                                        disabled={!hasSelectedIngredients}
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                                    {Object.entries(ingredientsByCategory).map(([category, ingredients]) => (
                                        <CategoryBox
                                            key={category}
                                            title={category}
                                            ingredients={ingredients.map(e => e.toLowerCase())}
                                            selectedIngredients={selectedIngredients}
                                            onSelectIngredient={handleIngredientChange}
                                        />
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col min-w-0 relative">
                        {renderHeader()}

                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                {userTab ? (
                                    renderUserSection()
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                        {renderRecipes()}
                                    </div>
                                )}
                            </div>
                        </div>

                        <AnimatePresence>
                            {showPopup && (
                                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50'>
                                    <Popup
                                        show={showPopup}
                                        message={popupMessage}
                                    />
                                </div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default RecipeFinder;