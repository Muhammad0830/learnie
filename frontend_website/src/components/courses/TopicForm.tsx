import { useState } from "react";

type Topic = {
  id: number;
  title: string;
  description: string;
};

export default function TopicsForm() {
  const [topics, setTopics] = useState<Topic[]>([
    { id: 0, title: "", description: "" },
  ]);

  // UPDATE A TOPIC FIELD
  const handleChange = (id: number, field: keyof Topic, value: string) => {
    setTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, [field]: value } : topic
      )
    );
  };

  return (
    <div>
      {topics.map((topic, index) => (
        <div key={topic.id} className="mb-4 border p-4 rounded-md">
          <h3 className="font-semibold mb-2">Topic {index + 1}</h3>

          <input
            type="text"
            value={topic.title}
            onChange={(e) => handleChange(topic.id, "title", e.target.value)}
            placeholder="Topic title"
            className="block w-full mb-2 border p-2 rounded"
          />

          <textarea
            value={topic.description}
            onChange={(e) =>
              handleChange(topic.id, "description", e.target.value)
            }
            placeholder="Topic description"
            className="block w-full border p-2 rounded"
          />
        </div>
      ))}
    </div>
  );
}
