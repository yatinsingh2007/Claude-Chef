import './App.css'
import {useState} from 'react'
import axios from 'axios'
import Markdown from 'react-markdown';
function App() {
  const [list,setList] = useState([]);
  const [recipe,setRecipe] = useState('');
  const [loading,setLoading] = useState(false);
  const geminiApi = import.meta.env.VITE_GEMINI_API
  const add = (event) => {
    event.preventDefault();
    const item = event.target['food-item'].value;
    if (!/^[a-zA-Z]+$/.test(item)) {
      alert("Only letters are allowed!");
      event.target.reset()
      return;
    }
    else if (list.includes(item.toLowerCase())){
      alert(`This item has already been added ad a new item.`)
      event.target.reset()
      return
    }
    else if(item){
      setList([...list,item.toLowerCase()])
    }else{
      alert('Please enter a valid item')
    }
    event.target.reset();
    return
}
  const remove = () => {
    if (list.length === 0) {
      alert("No items to remove!");
      return;
    }
    setList(list.slice(0, -1));
};
  async function getRecipe() {
    setLoading(true);
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApi}`,
      method: "post",
      data:{
        contents:[
          {parts:[{text: `Give me a dish using these ingredients ${list.join(', ')} and give me in an Order first The description , ingredients and Process to make.`}]}
        ]
      }
    })
    setLoading(false);
    setRecipe(response['data']['candidates'][0]['content']['parts'][0]['text']);
};
  return (
    <>
      <nav className="shadow shadow-grey p-1">
        <div className="flex gap-9 justify-center items-center py-2">
          <img 
            src="https://media.istockphoto.com/id/1406314247/vector/cook-chef-hat-icon-linear-chef-toque-vector-illustration-toque-chef-cook-table-restaurant.jpg?s=612x612&w=0&k=20&c=kwQUoI2lvf8auO3WaMRKy9TrfvlptCbtqPgUPj7gFFM=" 
            alt="Chef" 
            className="h-20 w-20"
          />
          <p className="text-xl font-mono font-semibold">Chef-Claude</p>
        </div>
      </nav>
      <section className='pt-7 font-mono'>
        <div className='flex justify-center gap-2'>
          <form className='flex justify-center items-center gap-3' onSubmit={add}>
            <input type='text' placeholder='e.g. oregano' className='border border-gray-300 p-2 rounded-lg w-1/2' name='food-item'/>
            <button className='bg-black text-white p-2 rounded-md cursor-pointer'>+Add item</button>
          </form>
          <button className='bg-black text-white p-2 rounded-md cursor-pointer' onClick={remove}>Remove Item</button>
        </div>
      </section>
      <div className='pt-6 flex-col justify-start items-start font-mono'>
        <h1 className='text-2xl font-bold'>Ingredient on Hands</h1>
        {list.length > 0 ? <ul className='pt-4 flex-col gap-3 flex-wrap'>{list.map((item) => <li>{item}</li>)}</ul> : <p className='pt-4'>Select Ingredients</p>}   
      </div>
      {list.length > 4 && <section className='p-4 bg-gray-100 mx-52 my-10 font-mono'>
      <div className='pb-7'>
        <h1 className='font-bold'>Ready For a Recipe?</h1>
      </div>
      <div className='flex justify-center items-center gap-3'>
        <p className='text-gray-500'>Genrate a recipe from your Ingredients</p>
        <button className='bg-red-400 p-3 rounded-lg cursor-pointer' onClick={getRecipe}>Get a Recipe</button>
      </div>
      </section>}
      {loading ? <p className='font-mono'>Loading...</p> :
      <div className='flex flex-col items-start justify-start font-mono p-10 text-left'><Markdown>{recipe}</Markdown></div>}
      {list.length > 4 && <footer className='bg-gray-100 p-4 flex mt-5 font-mono'>
        <div>&copy; Copyright claim 2025</div>
      </footer>}
    </> 
  );
}
export default App
