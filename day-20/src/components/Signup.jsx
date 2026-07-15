import { useState } from "react";
function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    skills: [],
    country: "",
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prevState[name], value]
            : prevState[name].filter((v) => v !== value)
          : value,
    }));

    console.log(formData);
  }

  function handleSubmit(event) {
    console.log("Submit called");
    event.preventDefault();
    console.log(formData);
  }

  function handleReset() {
    setFormData({
      name: "",
      email: "",
      gender: "",
      skills: [],
      country: "",
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Welcome on board!</h2>
        <p>We just need a little bit of data from you to get you started 🚀</p>

        <div className="control">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="control">
          <label htmlFor="gender">Gender</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
              required
            />
            Male
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
              required
            />
            Female
          </label>
        </div>
        <div className="control">
          <label htmlFor="country">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select...</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="Japan">Japan</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <fieldset>
          <legend>What are Your Skills?</legend>
          <div className="control">
            <input
              type="checkbox"
              name="skills"
              value="Reading"
              checked={formData.skills.includes("Reading")}
              onChange={handleChange}
            />
            <label htmlFor="reading">Reading</label>
          </div>

          <div className="control">
            <input
              type="checkbox"
              name="skills"
              value="Coding"
              checked={formData.skills.includes("Coding")}
              onChange={handleChange}
            />
            <label htmlFor="coding">Coding</label>
          </div>

          <div className="control">
            <input
              type="checkbox"
              name="skills"
              value="Communication"
              checked={formData.skills.includes("Communication")}
              onChange={handleChange}
            />
            <label htmlFor="communication">Communication</label>
          </div>
        </fieldset>
        <p className="form-actions">
          <button
            onClick={handleReset}
            type="reset"
            className="button button-flat"
          >
            Reset
          </button>
          <button type="submit" className="button">
            Register
          </button>
        </p>
      </form>
    </>
  );
}

export default Register;
