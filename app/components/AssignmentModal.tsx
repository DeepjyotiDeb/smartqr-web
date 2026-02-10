import React, { useState } from "react";
import { useNavigate } from "react-router";

export const AssignmentModal = () => {
	const [assignmentId, setAssignmentId] = useState("");
	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (assignmentId.trim()) {
			// Close the modal
			const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
			modal?.close();

			// Navigate to assignmentquiz page
			navigate(`/classes/assignments/${assignmentId}`, {
				viewTransition: true,
			});

			// Reset the input
			setAssignmentId("");
		}
	};
	return (
		<dialog id="my_modal_2" className="modal">
			<div className="modal-box">
				<form method="dialog">
					{/* if there is a button in form, it will close the modal */}
					<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
						✕
					</button>
				</form>

				<h3 className="text-lg font-bold mb-4">Join Assignment Quiz</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="form-control">
						{/* <label className='label'>
              <span className='label-text p-2'>Assignment ID</span>
            </label> */}
						<input
							type="text"
							placeholder="Enter assignment ID"
							className="input input-bordered w-full"
							value={assignmentId}
							onChange={(e) => setAssignmentId(e.target.value)}
							required
						/>
					</div>

					<div className="modal-action">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={!assignmentId.trim()}
						>
							Join Quiz
						</button>
					</div>
				</form>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};
