import './App.css'
import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown';

function App() {
  const [list, setList] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [came, setCame] = useState(false);
  const [footer , setfooter] = useState(false);
  const geminiApi = import.meta.env.VITE_GEMINI_API;

  const add = (event) => {
    event.preventDefault();
    const item = event.target['food-item'].value;
    if (!/^[A-Za-z]+$/.test(item)) {
      alert("Only letters are allowed!");
      event.target.reset();
      return;
    } else if (list.includes(item.toLowerCase())) {
      alert(`This item has already been added.`);
      event.target.reset();
      return;
    } else if (item) {
      setList([...list, item.toLowerCase()]);
    } else {
      alert('Please enter a valid item');
    }
    event.target.reset();
  };

  const remove = () => {
    if (list.length === 0) {
      alert("No items to remove!");
      return;
    }
    setList(list.slice(0, -1));
  };

  async function getRecipe() {
    setCame(true);
    setLoading(true);
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApi}`,
      method: "post",
      data: {
        contents: [
          {
            parts: [
              {
                text: `Give me a dish using these ingredients ${list.join(', ')} and provide the description, ingredients, and process in order.`
              }
            ]
          }
        ]
      }
    });
    setLoading(false);
    setRecipe(response.data.candidates[0].content.parts[0].text);
    setfooter(true);
  }

  return (
    <>
      <nav className="shadow-md bg-white p-3 flex justify-center items-center">
        <div className="flex gap-4 items-center">
          <img
            src="https://media.istockphoto.com/id/1406314247/vector/cook-chef-hat-icon-linear-chef-toque-vector-illustration-toque-chef-cook-table-restaurant.jpg?s=612x612&w=0&k=20&c=kwQUoI2lvf8auO3WaMRKy9TrfvlptCbtqPgUPj7gFFM="
            alt="Chef"
            className="h-16 w-16"
          />
          <p className="text-2xl font-semibold text-gray-700 font-mono">Chef-Claude</p>
        </div>
      </nav>
      <section className="pt-8 flex flex-col items-center">
        <form className="flex gap-3" onSubmit={add}>
          <input
            type="text"
            placeholder="e.g. oregano"
            className="border border-gray-300 p-3 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-red-400"
            name="food-item"
          />
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
            + Add item
          </button>
        </form>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-gray-600 transition"
          onClick={remove}
        >
          Remove Item
        </button>
      </section>
      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Ingredients on Hand</h1>
        {list.length > 0 ? (
          <ul className="pt-4 flex flex-wrap justify-center gap-3">
            {list.map((item, index) => (
              <li key={index} className="bg-gray-200 px-3 py-1 rounded-md text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="pt-4 text-gray-500">Select Ingredients</p>
        )}
      </div>
      {list.length > 0 && !came && (
        <section className="p-6 bg-gray-100 mt-8 rounded-lg text-center shadow-md mx-auto max-w-lg">
          <h1 className="text-xl font-bold text-gray-700">Ready for a Recipe?</h1>
          <p className="text-gray-500 mt-2">Generate a recipe from your Ingredients</p>
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-red-600 transition"
            onClick={getRecipe}
          >
            Get a Recipe
          </button>
        </section>
      )}
      {loading ? (
        <div className="flex justify-center items-center mt-6">
          <span className="rounded-full border-4 border-red-500 h-10 w-10 border-t-transparent animate-spin"></span>
        </div>
      ) : (
        recipe && (
          <div className="recipe-section bg-white p-6 mt-8 rounded-lg shadow-md mx-auto max-w-lg">
            <div className='text-left p-2'><ReactMarkdown>{recipe}</ReactMarkdown></div>
          </div>
        )
      )}
      {footer && (
        <footer className="bg-gray-100 p-4 text-center text-gray-600 mt-10">
          &copy; 2025 Chef-Claude. All rights reserved.
        </footer>
      )}
    </>
  );
}

export default App;
