import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

       if(email === "" || password === ""){
        setError("Please fill in both fields.");
       }else{
        setError("");
        navigate('/');
        console.log("Successfully logging you with: ", {email});
       }
    }

    return (
        <>
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Email</label>
        <input 
        type="email" 
        value = {email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
        placeholder="Enter your email"
         />
      </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Password</label>
        <input 
        value = {password}
        onChange={(e) => setPassword(e.target.value)}
        type="password" 
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" 
        placeholder="Enter your password" 
        />
      </div>

      <div className="flex justify-end mb-4">
        <a href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</a>
      </div>

      <button 
      type="submit" 
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Login</button>
    </form>

    <div className="flex items-center my-4">
      <div className="flex-grow h-px bg-gray-300"></div>
      <span className="mx-2 text-gray-400">OR</span>
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>

    <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
      Login with Google
    </button>

    <p className="text-center text-sm mt-6">
      Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign Up</a>
    </p>

  </div>
</div>
        </>
    )
}

export default Login