import Image from "next/image";

function Nav() {
    return (
        
        <div>
        
        <div className="w-full h-20 bg-black border-b-8 border-[#bdd248] flex items-center px-12">
        <Image src={"https://lab-engineering.actia.tn/wp-content/uploads/2021/02/logo-actia.png"} alt="logo" width={180} height={40} />
        <p className="text-white w-full text-center font-extrabold text-lg font-sans">CONFIG GENERATOR</p>
        </div>

        </div>
     );
}

export default Nav;