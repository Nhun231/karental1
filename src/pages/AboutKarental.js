import Layout from "../components/common/Layout";
import img from "../assets/car_owner_banner.jpg"
function KarentalIntro() {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "2rem" }}>
            <div style={{ width: "50%", color: "black", fontWeight: "bold", fontSize: "4rem", lineHeight: "1.5" }}>
                <span style={{ color: "#05ce80" }}>Karental</span> - With You on Every Journey
            </div>
            <div style={{ width: "50%", color: "#4A4A4A", fontSize: "1.125rem", paddingLeft: "2rem", marginTop: "1rem", lineHeight: "1.5" }}>
                Every trip is a journey of discovering life and the world around us, an opportunity to learn and conquer new experiences to become better individuals. Therefore, customer experience quality is our top priority and the source of inspiration for the KaRental team.
                <br /><br />
                Karental is a car-sharing platform. Our mission is not only to connect car owners and customers in a Fast - Safe - Convenient way, but also to inspire the community to EXPLORE new things through journeys on our platform.
            </div>
        </div>
    );
}

function KarentalMission() {
    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "2rem" }}>
            <div style={{ width: "50%", color: "black" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Drive. Explore. Inspire</h1>
                <p style={{ fontSize: "1.125rem", marginTop: "4rem" }}>
                    <strong>Drive</strong> and <strong>Explore</strong> the world full of <strong>Inspiration</strong>.
                </p>
                <div>
                    <p style={{ color: "#4A4A4A", marginTop: "1rem", lineHeight: "1.5" }}>
                        Karental aims to become the #1 reputable and civilized car-sharing community in Vietnam,
                        providing practical value to all members for a better life.
                    </p>
                    <p style={{ color: "#4A4A4A", marginTop: "1rem", lineHeight: "1.5" }}>
                        We believe that every journey matters. That’s why our team and partners, with extensive
                        experience in car rentals, technology, insurance, and tourism, are committed to bringing
                        new, exciting experiences and the highest level of safety to your journey.
                    </p>
                </div>
            </div>
            <div style={{ width: "50%", marginTop: "1.5rem", paddingLeft: "2rem" }}>
                <img
                    src={img}
                    alt="Car driving on an open road"
                    style={{
                        borderRadius: "8px",
                        width: "100%",
                        height: "auto",
                        clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)"
                    }}
                />
            </div>
        </div>
    );
}

export default function AboutUs() {
    return (
        <Layout>
            <div style={{ maxWidth: "1200px", margin: "auto", padding: "2rem" }}>
                <KarentalIntro />
                <div style={{ margin: "3rem 0" }} />
                <KarentalMission />
            </div>
        </Layout>
    );
}
