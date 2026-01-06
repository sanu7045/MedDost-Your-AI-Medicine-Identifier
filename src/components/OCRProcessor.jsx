import { useState } from "react";
import Tesseract from 'tesseract.js';
import medicines from '../data/medicines.json';

export default function OCRProcessor(){

    const [image,setImage]=useState(null);
    const [result,setResult]=useState('');
    const [matchedMedicine, setMatchedMedicine]=useState(null);
    const [loading, setLoading]=useState(false);

    const handleImageUpload=(e)=>{
        setImage(URL.createObjectURL(e.target.files[0]));
    }

    const processImage=()=>{
        setLoading(true);
             Tesseract.recognize(image, 'eng',{
         logger:m=>console.log(m),
        }).then(({data:{text}})=>{
            setResult(text);
            const match=medicines.find(med=>text.toLowerCase().includes(med.name.toLowerCase()));

            setMatchedMedicine(match || null);
            setLoading(false);
        });
       
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow rounded items-center">
            <input 
            className="block border-2 rounded text-sm file:uppercase file:text-bg-primary file:px-4 file:h-9.5 file:rounded-field cursor-pointer file:font-medium file:text-base file:me-3 "
            type="file" accept="image/*" onChange={handleImageUpload}/>
            {image && <img src={image} alt="preview" className="my-4" />}

            <button onClick={processImage} className="items-center bg-blue-600 text-white font-bold mt-4 px-4 py-2 rounded">
                { loading ? "Processing..." : "Identify Medicine" }

            </button>

            {
                matchedMedicine ? (
                    <div className="mt-4 p-4 bg-green-100 rounded">
                        <h2 className="text-xl font-semibold">{matchedMedicine.name}</h2>
                        <p><strong>Use:</strong>{matchedMedicine.use}</p>
                        <p><strong>Dosage:</strong>{matchedMedicine.dosage}</p>
                    </div>
                ) : result && (
                    <div className="mt-4 p-4 bg-red-100 rounded">
                        <p> Medicine not found in database</p>
                    </div>
                )
            }
        </div>
    );
}