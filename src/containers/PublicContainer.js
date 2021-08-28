const PublicContainer = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <div
          style={{ height: "500px", width: "800px" }}
          className="grid grid-cols-2 shadow shadow-lg rounded-lg"
        >
          <div className="col-span-1">
            <img
              src="/images/public_page_img.jpg"
              className="object-cover"
              style={{ height: "100%", width: "100%" }}
              alt=""
            />
          </div>
          <div className="col-span-1 flex items-center justify-center p-6">
            {children}
          </div>
        </div>
        <div className="text-center mt-6">
          <span className="text-xs text-gray-400">
            Winebat Ltd. &#169; copyright 2021
          </span>
        </div>
      </div>
    </div>
  );
};

export default PublicContainer;
