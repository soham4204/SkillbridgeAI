import Icons from "./Icons";

const SearchBar = () => (
    <div className="w-full mb-6">
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icons.Search />
        </span>
        <input
          type="text"
          placeholder="Search for jobs, companies, or keywords..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

export default SearchBar;