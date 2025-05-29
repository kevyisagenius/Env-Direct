const Spinner = ({ size = 'h-12 w-12', color = 'border-white' }) => {
  return (
    <div className={`flex justify-center items-center py-10`}>
      <div
        className={`animate-spin rounded-full ${size} border-t-2 border-b-2 ${color}`}
      ></div>
    </div>
  );
};

export default Spinner; 