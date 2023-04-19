import Link from "next/link";
import { useLoggedUser } from "../store/UserContext";

export default function Home() {
  const { logged, setLogged } = useLoggedUser();
  return (
    <section class="xop-container">
      <div class="xop-left">
        <Link href="/client" class="linkButt">
          <button class="btn-85">CHECK YOUR FUTURE</button>
        </Link>
      </div>
      <div class="xop-right">
        {logged && (
          <Link href="/newJob" class="linkButt">
            <button class="btn-85">CREATE A JOB</button>
          </Link>
        )}
      </div>
    </section>
  );
}
