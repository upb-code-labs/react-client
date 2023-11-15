import { Save } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface RubricNameProps {
  rubricUUID: string;
  rubricName: string;
}

export const RubricName = ({ rubricUUID: _, rubricName }: RubricNameProps) => {
  const [name, setName] = useState(rubricName);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
  };

  const handleUpdateName = () => {
    // TODO: Send a request to the api
    console.log("Update name");
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Input
        required
        name="name"
        value={name}
        min={4}
        max={96}
        aria-label="Name"
        className="md:w-1/4"
        onChange={handleNameChange}
        placeholder="Enter a name for the rubric here..."
      />
      <Button onClick={handleUpdateName}>
        <Save className="mr-2" />
        Update Name
      </Button>
    </div>
  );
};
