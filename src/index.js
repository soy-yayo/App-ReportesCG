function agregarReporte() {
    Swal.fire({
        title: 'Creación de reporte',
        text: 'Ingresa los datos que se solicitan:',
        html: `
          <form id="reportForm">
          <!-- Campo de Fecha -->
          <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700">Fecha</label>
            <input type="date" id="date" name="date" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
          </div>

          <!-- Campo de Tipo de Inmueble -->
          <div class="mb-4">
            <label for="propertyType" class="block text-sm font-medium text-gray-700">Tipo de inmueble</label>
            <input type="text" id="propertyType" name="propertyType" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
          </div>

          <!-- Campo de Ubicación -->
          <div class="mb-4">
            <label for="location" class="block text-sm font-medium text-gray-700">Ubicación</label>
            <input type="text" id="location" name="location" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Ubicación del trabajo" required>
          </div>

          <!-- Campo de Ubicación de Equipos -->
          <div class="mb-4">
            <label for="equipmentLocation" class="block text-sm font-medium text-gray-700">Ubicación de los equipos</label>
            <input type="text" id="equipmentLocation" name="equipmentLocation" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
          </div>

          <!-- Campo de Distribución de Aire -->
          <div class="mb-4">
            <label for="airDistribution" class="block text-sm font-medium text-gray-700">Distribución de aire</label>
            <input type="text" id="airDistribution" name="airDistribution" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
          </div>

          <!-- Campo de Falla Reportada -->
          <div class="mb-4">
            <label for="reportedIssue" class="block text-sm font-medium text-gray-700">Falla Reportada</label>
            <input type="text" id="reportedIssue" name="reportedIssue" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
          </div>

          <!-- Problemas Reportados -->
          <div class="mb-4">
            <label for="problems" class="block text-sm font-medium text-gray-700">Problemas Reportados</label>
            <div id="problemsContainer">
              <input type="text" name="problems[]" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
            </div>
            <button type="button" id="addProblem" class="mt-2 text-green-500 hover:text-green-700">+ Añadir Problema</button>
          </div>

          <!-- Trabajos Realizados -->
          <div class="mb-4">
            <label for="activities" class="block text-sm font-medium text-gray-700">Trabajos Realizados</label>
            <div id="activitiesContainer">
              <input type="text" name="activities[]" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
            </div>
            <button type="button" id="addActivity" class="mt-2 text-green-500 hover:text-green-700">+ Añadir Trabajo</button>
          </div>

          <!-- Trabajos Pendientes -->
          <div class="mb-4">
            <label for="pending" class="block text-sm font-medium text-gray-700">Trabajos Pendientes</label>
            <div id="pendingContainer">
              <input type="text" name="pending[]" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" required>
            </div>
            <button type="button" id="addPending" class="mt-2 text-green-500 hover:text-green-700">+ Añadir Trabajo Pendiente</button>
          </div>

          <!-- Campo de Imágenes -->
          <div class="mb-4">
            <label for="images" class="block text-sm font-medium text-gray-700">Subir Imágenes</label>
            <input type="file" id="images" name="images[]" class="mt-1 block w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" multiple accept="image/*">
          </div>
        </form>
        `,
        confirmButtonText: 'Agregar',
        preConfirm: async () => {
            const date = document.getElementById('date').value;
            const propertyType = document.getElementById('propertyType').value;
            const location = document.getElementById('location').value;
            const equipmentLocation = document.getElementById('equipmentLocation').value;
            const airDistribution = document.getElementById('airDistribution').value;
            const reportedIssue = document.getElementById('reportedIssue').value;

            // Recuperar los valores de los campos dinámicos
            const problems = Array.from(document.getElementsByName('problems[]')).map(input => input.value);
            const activities = Array.from(document.getElementsByName('activities[]')).map(input => input.value);
            const pending = Array.from(document.getElementsByName('pending[]')).map(input => input.value);

            // Obtener las imágenes
            const images = document.getElementById('images').files;
            const imagePromises = Array.from(images).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);  // Convertir la imagen a base64
                    reader.onerror = (e) => reject(e);  
                    reader.readAsDataURL(file);  // Leer el archivo como una URL base64
                });
            });

            const imageBase64Array = await Promise.all(imagePromises);  // Esperar a que todas las imágenes se conviertan a base64

            // Validar los campos
            if (!date || !propertyType || !location || !equipmentLocation || !airDistribution || !reportedIssue) {
                Swal.showValidationMessage('Todos los campos son requeridos');
                return false;
            }

            // Crear el reporte
            const nuevoReporte = {
                date,
                propertyType,
                location,
                equipmentLocation,
                airDistribution,
                reportedIssue,
                problems,
                activities,
                pending,
                images: imageBase64Array  // Guardar las imágenes en base64
            };

            // Guardar el reporte en localStorage
            let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
            reportes.push(nuevoReporte);
            localStorage.setItem('reportes', JSON.stringify(reportes));

            // Mostrar el reporte en la página
            mostrarReportes();

            Swal.fire('Éxito', 'El reporte ha sido guardado correctamente.', 'success');
        }
    });

    // Lógica para añadir campos dinámicos
    document.getElementById('addProblem').addEventListener('click', () => {
        const problemsContainer = document.getElementById('problemsContainer');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'problems[]';
        input.className = 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm';
        problemsContainer.appendChild(input);
    });

    document.getElementById('addActivity').addEventListener('click', () => {
        const activitiesContainer = document.getElementById('activitiesContainer');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'activities[]';
        input.className = 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm';
        activitiesContainer.appendChild(input);
    });

    document.getElementById('addPending').addEventListener('click', () => {
        const pendingContainer = document.getElementById('pendingContainer');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'pending[]';
        input.className = 'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm';
        pendingContainer.appendChild(input);
    });
}

const btnNewReport = document.getElementById('agregar-reporte');
btnNewReport.addEventListener('click', agregarReporte);


function mostrarReportes() {
    const reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    const reportesContainer = document.getElementById('reportes-container');

    // Limpiar el contenido anterior
    reportesContainer.innerHTML = '';

    // Iterar sobre los reportes y mostrarlos en la página
    reportes.forEach((reporte, index) => {
        const reporteDiv = document.createElement('div');
        reporteDiv.className = 'reporte mb-4 p-4 border rounded-md shadow-sm';

        // Crear el HTML para las imágenes
        let imagenesHtml = '';
        if (reporte.images && reporte.images.length > 0) {
            imagenesHtml = reporte.images.map(image => `<img src="${image}" alt="Imagen del reporte" class="w-32 h-32 object-cover mr-2 mb-2">`).join('');
        }
        reporteDiv.innerHTML = `
            <h3 class="text-lg font-semibold">Reporte ${index + 1}</h3>
            <p><strong>Fecha:</strong> ${reporte.date}</p>
            <p><strong>Tipo de Inmueble:</strong> ${reporte.propertyType}</p>
            <p><strong>Ubicación:</strong> ${reporte.location}</p>
            <p><strong>Ubicación de los Equipos:</strong> ${reporte.equipmentLocation}</p>
            <p><strong>Distribución de Aire:</strong> ${reporte.airDistribution}</p>
            <p><strong>Falla Reportada:</strong> ${reporte.reportedIssue}</p>
            <p><strong>Problemas Reportados:</strong> ${reporte.problems.join(', ')}</p>
            <p><strong>Trabajos Realizados:</strong> ${reporte.activities.join(', ')}</p>
            <p><strong>Trabajos Pendientes:</strong> ${reporte.pending.join(', ')}</p>
            <div><strong>Imágenes:</strong><div class="flex flex-wrap">${imagenesHtml}</div></div>
        `;

        reportesContainer.appendChild(reporteDiv);
    });
}

window.addEventListener('DOMContentLoaded', mostrarReportes);