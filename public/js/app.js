document.addEventListener('DOMContentLoaded', () => {
    // OPD Booking page setup
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        loadAppointments();
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('medicore_user'));
            if (!user) {
                alert('Please login first to book an appointment.');
                window.location.href = 'login.html';
                return;
            }

            const [doctorName, specialization, roomNo] = document.getElementById('doctorSelect').value.split('|');
            const payload = {
                patientId: user.id,
                doctorName,
                specialization,
                roomNo,
                date: document.getElementById('date').value,
                timeSlot: document.getElementById('timeSlot').value
            };

            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Appointment booked successfully! Token: ${data.appointment.tokenNumber}`);
                bookingForm.reset();
                loadAppointments();
            } else {
                alert(data.error);
            }
        });
    }

    // Community Feed page setup
    const communityForm = document.getElementById('community-form');
    if (communityForm) {
        loadCommunityPosts();
        communityForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('medicore_user'));
            if (!user) {
                alert('Please login first to post community alerts.');
                window.location.href = 'login.html';
                return;
            }

            const payload = {
                authorId: user.id,
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                bloodGroupNeeded: document.getElementById('bloodGroupNeeded').value,
                hospitalOrLocation: document.getElementById('hospitalOrLocation').value,
                contactPhone: document.getElementById('contactPhone').value,
                description: document.getElementById('description').value
            };

            const res = await fetch('/api/community', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                alert('Community alert published successfully!');
                communityForm.reset();
                loadCommunityPosts();
            } else {
                alert(data.error);
            }
        });
    }
});

async function loadAppointments() {
    try {
        const res = await fetch('/api/appointments');
        const apps = await res.json();
        const container = document.getElementById('appointments-list');
        if (!container) return;

        if (apps.length === 0) {
            container.innerHTML = '<p>No appointments booked yet.</p>';
            return;
        }

        container.innerHTML = apps.map(app => `
            <div class="card">
                <span class="badge token">${app.tokenNumber}</span>
                <h4>Patient: ${app.patient ? app.patient.name : 'Unknown'}</h4>
                <p><strong>Doctor:</strong> ${app.doctorName} (${app.specialization})</p>
                <p><strong>Room:</strong> ${app.roomNo}</p>
                <p><strong>Date & Slot:</strong> ${app.date} at ${app.timeSlot}</p>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function loadCommunityPosts() {
    try {
        const res = await fetch('/api/community');
        const posts = await res.json();
        const container = document.getElementById('community-feed');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<p>No active community alerts right now.</p>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <div class="card community-card">
                <div class="card-header">
                    <span class="badge category">${post.category}</span>
                    ${post.bloodGroupNeeded !== 'N/A' ? `<span class="badge blood">${post.bloodGroupNeeded}</span>` : ''}
                </div>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <p><strong>Location:</strong> ${post.hospitalOrLocation}</p>
                <p><strong>Contact:</strong> <a href="tel:${post.contactPhone}">${post.contactPhone}</a></p>
                <button class="btn-resolve" onclick="resolvePost('${post._id}')">Mark Resolved</button>
            </div>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

async function resolvePost(id) {
    if (!confirm('Mark this community request as resolved?')) return;
    const res = await fetch(`/api/community/${id}/resolve`, { method: 'PATCH' });
    if (res.ok) {
        loadCommunityPosts();
    }
}