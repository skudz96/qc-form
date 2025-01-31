import { useState } from "react";
import axios from "axios";

const FormComponent = () => {
  // State for all necessary data
  const [id, setId] = useState("");
  const [varMass, setVarMass] = useState("");
  const [thing1HasHappened, setThing1HasHappened] = useState(false);
  const [thing2HasHappened, setThing2HasHappened] = useState(false);
  const [partId, setPartId] = useState("");

  // This holds the message that is returned from the server
  const [message, setMessage] = useState("");
  // This holds the loading state of the form
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put("http://localhost:5000", {
        id,
        var_mass: varMass,
        thing_1_has_happened: thing1HasHappened,
        thing_2_has_happened: thing2HasHappened,
        part_id: partId,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occured. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          required
        />
        <input
          type="text"
          value={varMass}
          onChange={(e) => setVarMass(e.target.value)}
          placeholder="Var Mass"
          required
        />
        <input
          type="checkbox"
          checked={thing1HasHappened}
          onChange={(e) => setThing1HasHappened(e.target.checked)}
        />{" "}
        Thing 1 Has Happened
        <input
          type="checkbox"
          checked={thing2HasHappened}
          onChange={(e) => setThing2HasHappened(e.target.checked)}
        />{" "}
        Thing 2 Has Happened
        <input
          type="text"
          value={partId}
          onChange={(e) => setPartId(e.target.value)}
          placeholder="Part ID"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FormComponent;
