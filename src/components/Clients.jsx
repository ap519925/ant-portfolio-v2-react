import React from 'react';
import { clients } from '../data/clients';
import { motion } from 'framer-motion';
import './Clients.css';

const Clients = () => {
    // Duplicate list for seamless infinite scroll
    const allClients = [...clients, ...clients];

    return (
        <section className="section clients-section">
            <div className="container" style={{ maxWidth: '100%' /* Full width for marquee */ }}>
                <h3 className="section-title">Previous Clients & Employers</h3>

                <div className="marquee-container">
                    <div className="marquee-track">
                        {allClients.map((client, index) => (
                            <div
                                key={index}
                                className="client-logo-wrapper"
                                title={client.name}
                            >
                                <img src={client.logo} alt={client.name} className="client-logo" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Clients;
