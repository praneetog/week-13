import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { SignupInput } from '@praneetog/medium-common';

export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    })

    return <div className="h-screen flex justify-center items-center">
        <div className='flex justify-center flex-col items-center w-[85%]'>
            <div className='items-center text-center'>
                <div className='text-4xl font-bold'>
                    { type === "signin" ? "Login" : "Create an account" }
                </div>
                <div className='text-slate-500 pt-4 pb-8'>
                    { type === "signin" ? "Don't have an account?" : "Already have an account?" }
                    <Link className='pl-2 underline' to={ type === "signin" ? "/signup" : "/signin" }>
                        { type === "signin" ? "Sign up" : "Login" }
                    </Link>
                </div>
            </div>
            <div className='w-[70%] md:'>
                { type === "signup" ? <LabelledInput label='Username' placeholder='Praneet Kashyap' onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        name: e.target.value
                    })
                }} /> : null }
                <LabelledInput label='Email' placeholder='praneet@gmail.com' onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        username: e.target.value
                    })
                }} />
                <LabelledInput label='Password' type={'password'} placeholder='12345678' onChange={(e) => {
                    setPostInputs({
                        ...postInputs,
                        name: e.target.value
                    })
                }} />
            </div>
            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm py-2.5 my-2 w-[70%]">{type === "signin" ? "Login" : "Sign up"}</button>
        </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div>
        <label className="block mb-2 text-sm text-black font-bold">{ label }</label>
        <input onChange={onChange} type={ type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 placeholder-slate-300 mb-5" placeholder={ placeholder } required />
    </div>
}
