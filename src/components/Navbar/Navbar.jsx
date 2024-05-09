import { NavLink } from "react-router-dom";
const Navbar = () => {
    const navLink = <>
<NavLink className="btn btn-success" to="/registration">Registration</NavLink>
<NavLink className="btn btn-info" to="/login">Login</NavLink>
    </>
    return (
        <div className="mx-[100px]">
            <div className="navbar bg-gray-400	rounded-lg">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost text-xl">Authentication</NavLink>
                </div>
                <div className="">
                    <ul className="flex gap-3">
                        {
                            navLink
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;