import Image from "next/image";
import TitleBar from "./components/TitleBar";

export default function Home() {
	return (
		<>
			<TitleBar title={""} />
			<div className="container-fluid pt-3">
				<div className="row g-3">
					<div className="col-3">
						<div className="card card-body shadow">
							<a role="button" href="/seasons" className="btn btn-outline-warning text-black mb-2">
								Stagioni
							</a>
							<a role="button" href="/schedules" className="btn btn-outline-warning text-black mb-2">
								Schedulazioni
							</a>
							<a role="button" href="/societa" className="btn btn-outline-warning text-black mb-2">
								Societa
							</a>
							<a role="button" href="/seasons" className="btn btn-outline-warning text-black mb-2">
								Giocatori
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
