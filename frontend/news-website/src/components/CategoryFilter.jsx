const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: "business", name: "Business", icon: "💼" },
    { id: "entertainment", name: "Entertainment", icon: "🎬" },
    { id: "general", name: "All News", icon: "📰" },
    { id: "health", name: "Health", icon: "🏥" },
    { id: "science", name: "Science", icon: "🔬" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "technology", name: "Technology", icon: "💻" },
  ];
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <h2 className="text-lg font-bold text-gray-700 mb-3">Categories</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
