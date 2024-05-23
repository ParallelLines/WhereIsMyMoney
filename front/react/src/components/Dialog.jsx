import { useState } from "react";

export default function Dialog({ children, open }) {
    return open && (
        <div className="dialog">
            {children}
        </div>
    )
}
