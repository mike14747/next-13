'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
    const [showAdditional, setShowAdditional] = useState(false);

    return (
        <>
            <h2>Homepage</h2>

            <p>
                This is the homepage in the app folder.
            </p>

            <p>
                {showAdditional
                    ? <button onClick={() => setShowAdditional(false)}>Hide Additional</button>
                    : <button onClick={() => setShowAdditional(true)}>Show Additional</button>
                }
            </p>

            {showAdditional &&
                <p>
                    <Link href="/page1">
                        This will only be shown when enabled.
                    </Link>
                </p>
            }
        </>
    );
}
