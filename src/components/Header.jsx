
import MenuTop from "./navigation/MenuTop";
import MenuMobile from "./navigation/MenuMobile";
import Hamburger from "./navigation/Hamburger";


export default function Header({ loggedIn = false }) {



    let items = [
        {
            url: "/",
            label: "home"
        },
        {
            url: "/settings",
            label: "settings",
            hidden: true
        }
    ];

    let loginItem = {
        url: "/login",
        label: "login",
        hidden: true,
        // loggedIn: loggedIn
    };

    let logoutItem = {
        url: "/logout",
        label: "logout",
        hidden: true,
        // loggedIn: loggedIn
    };

    if (loggedIn) {
        console.log("User is logged in");
        items.push(logoutItem);
    } else {
        console.log("User is NOT logged in");
        items.push(loginItem);
    }

    // 

    return (
        <header className="w-full mb-0 pb-1 p-[10px] sticky top-0 bg-default-background z-50">
            <nav className="tablet:px-8">

                <ul className="text-zinc-100 inline-block" style={{ width: "100%" }}>

                    <li style={{ verticalAlign: "middle" }} className="inline-block p-3 laptop:px-4">
                        <a href="/">
                            <img className="w-[100px]" style={{ display: "inline-block", verticalAlign: "middle" }} src="/images/logos/logo.png" />
                        </a>
                    </li>

                    <MenuTop items={items} />

                    <li style={{ float: "right" }} className={`hidden phone:hidden tablet:inline-block`}>
                        <Hamburger />
                    </li>
                </ul>

                <ul id="mobile-menu" className="text-slate-50 block hidden min-h-[100vh] pt-[15vh]">
                    <MenuMobile items={items} />
                </ul>
            </nav>

        </header>
    );
}
