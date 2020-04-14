import React from "react";

export function ModalCLoseButton({ onClick }) {
    return (
        <div>
            <button onClick={onClick} type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
    )
}