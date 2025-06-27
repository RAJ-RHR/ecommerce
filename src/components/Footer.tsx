export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="font-bold text-base mb-1">About Us</h3>
          <p>We provide top quality health and wellness products to transform your life.</p>
        </div>
        <div className="text-center md:text-right">
          <h3 className="font-bold text-base mb-1">Address</h3>
          <p>Mumbai, Maharashtra, India</p>
          <p>Email: contact@herbolife.in</p>
        </div>
      </div>
      <p className="text-center text-gray-400 text-xs mt-4">
        © {new Date().getFullYear()} Herbolife. All rights reserved.
      </p>
    </footer>
  );
}
