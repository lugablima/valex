import "./setup";
import app from "./index";

const PORT = Number(process.env.PORT) | 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
