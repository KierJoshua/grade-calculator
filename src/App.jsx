import React, { useState } from "react";
import grade from "./components/gradesData";

function App() {
  const [isAdding, setIsAdding] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [gradeCategory, setGradeCategory] = useState(grade);
  const [addGradeCategory, setAddGradeCategory] = useState({ name: "" });
  const [formula, setFormula] = useState("");
  const [grades, setGrades] = useState({});
  const [totalGrade, setTotalGrade] = useState(null);

  // Handle adding a new grade category
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddGradeCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (addGradeCategory.name.trim() === "") return;

    const lastGrade = gradeCategory[gradeCategory.length - 1]?.name || "A:";
    const lastLetter = lastGrade.charAt(0);
    const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
    const newGrade = { name: `${nextLetter}: ${addGradeCategory.name}` };

    setGradeCategory((prev) => [...prev, newGrade]);
    setAddGradeCategory({ name: "" });
    setIsAdding(false);
  };

  // Handle formula input
  const handleInputFormula = (e) => {
    setFormula(e.target.value);
  };

  // Handle grade input
  const handleGradeChange = (e, letter) => {
    const { value } = e.target;
    setGrades((prev) => ({ ...prev, [letter.toUpperCase()]: parseFloat(value) || 0 }));
  };

  // Function to safely evaluate the formula
  const handleCalculate = () => {
    if (!formula) {
      alert("Please enter a formula!");
      return;
    }

    try {
      let modifiedFormula = formula.toUpperCase(); // Convert formula to uppercase for consistency

      // Convert percentages to decimal
      modifiedFormula = modifiedFormula.replace(/(\d+)%/g, (match, num) => {
        return (parseFloat(num) / 100).toString();
      });

      // Replace letter variables (A, B, C, etc.) with actual grades
      gradeCategory.forEach((g) => {
        const letter = g.name.charAt(0).toUpperCase(); // Ensure uppercase letter
        if (grades[letter] !== undefined) {
          modifiedFormula = modifiedFormula.replaceAll(letter, `(${grades[letter]})`);
        }
      });

      console.log("Evaluating Formula:", modifiedFormula);

      // Evaluate the modified formula
      const calculatedGrade = new Function(`return ${modifiedFormula}`)();
      setTotalGrade(calculatedGrade.toFixed(2));
      setIsCalculated(true);
    } catch (error) {
      console.error("Invalid formula:", error);
      alert("Invalid formula! Please check your input.");
    }
  };

  return (
    <div className="bg-gray-400 min-h-screen flex justify-center">
      <div className="rounded-lg min-w-2/3 bg-gray-300 my-12 p-5">
        <h1 className="text-4xl text-center py-8 font-bold">
          Simple Grade Calculator
        </h1>

        <ul className="ms-10 flex flex-col gap-2">
          {gradeCategory.map((g, index) => (
            <li key={index} className="text-xl">
              {g.name}
            </li>
          ))}
          <button
            className="bg-blue-400 rounded py-2 px-10 self-start cursor-pointer text-white hover:bg-blue-500"
            onClick={() => setIsAdding(!isAdding)}
          >
            Add Category
          </button>
          {isAdding && (
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Type category name"
                className="input"
                name="name"
                value={addGradeCategory.name}
                onChange={handleInputChange}
              />
              <button
                className="bg-green-400 rounded py-2 px-10 self-start cursor-pointer text-white hover:bg-green-500"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          )}
        </ul>

        <div className="my-5 mx-10 flex flex-col gap-3">
          <p className="text-lg font-semibold">Formula</p>
          <input
            type="text"
            placeholder="Example: (A*25%) + (b*25%) + (c*50%)"
            value={formula}
            onChange={handleInputFormula}
            className="input w-full p-2 border border-gray-400 rounded"
          />

          <p className="text-lg font-semibold">Enter Grades</p>
          {gradeCategory.map((g, index) => {
            const letter = g.name.charAt(0).toUpperCase(); // Ensure uppercase letter
            return (
              <input
                type="number"
                placeholder={g.name}
                key={index}
                className="input w-full p-2 border border-gray-400 rounded"
                onChange={(e) => handleGradeChange(e, letter)}
              />
            );
          })}

          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 self-center"
            onClick={handleCalculate}
          >
            Calculate
          </button>

          {isCalculated && (
            <div>
              <h1 className="text-center text-2xl font-bold">Total Grade:</h1>
              <h1 className="text-center text-2xl font-bold text-blue-500">{totalGrade}%</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
