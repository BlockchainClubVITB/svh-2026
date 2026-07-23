// utils/generateIdCard.js
// ID Card Generation Logic - Separated from UI

export const CARD_WIDTH = 1448;
export const CARD_HEIGHT = 1086;

/**
 * Generate ID card with user photo and details
 * @param {Object} params - Generation parameters
 * @param {string} params.templateSrc - Path to template image
 * @param {string} params.userImageSrc - User photo data URL
 * @param {string} params.name - User's full name
 * @param {string} params.registrationNumber - User's registration number
 * @returns {Promise<string>} Data URL of generated ID card
 */
export async function generateIdCard({
    templateSrc = '/student_coordinator.jpeg',
    userImageSrc,
    name,
    registrationNumber,
}) {
    // Load template first to get its natural dimensions
    const template = new Image();
    template.crossOrigin = 'anonymous';
    template.src = templateSrc;
    await new Promise((resolve, reject) => {
        template.onload = resolve;
        template.onerror = (e) => reject(new Error('Failed to load template image: ' + templateSrc));
    });

    // Create canvas with template's natural dimensions
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');

    // Draw the full template at its natural dimensions
    ctx.drawImage(template, 0, 0);

    // Load user image if provided
    if (userImageSrc) {
        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';
        userImg.src = userImageSrc;
        await new Promise((resolve, reject) => {
            userImg.onload = resolve;
            userImg.onerror = (e) => reject(new Error('Failed to load user photo'));
        });

        // ══════════════════════════════════════════════════════════
        // 🛠️ ADJUST USER PHOTO POSITION AND SIZE HERE
        // ══════════════════════════════════════════════════════════
        const photoX = 240;      // X position (left edge of photo box)
        const photoY = 323;      // Y position (top edge of photo box)
        const photoWidth = 292;  // Width of photo box
        const photoHeight = 300; // Height of photo box
        // ══════════════════════════════════════════════════════════

        ctx.save();
        ctx.beginPath();
        ctx.rect(photoX, photoY, photoWidth, photoHeight);
        ctx.clip();

        // Scale to cover-fit: fill entire box while maintaining aspect ratio
        const scale = Math.max(
            photoWidth / userImg.width,
            photoHeight / userImg.height
        );

        const drawWidth = userImg.width * scale;
        const drawHeight = userImg.height * scale;

        // Draw centered user image
        ctx.drawImage(
            userImg,
            photoX + (photoWidth - drawWidth) / 2,
            photoY + (photoHeight - drawHeight) / 2,
            drawWidth,
            drawHeight
        );

        ctx.restore();
    }

    // ══════════════════════════════════════════════════════════
    // 🛠️ ADJUST TEXT POSITION, FONTS AND COLORS HERE
    // ══════════════════════════════════════════════════════════
    const textCenterX = 385;  // Center X for all text on left card
    const nameY = 855;        // Y position for Full Name
    const regNoY = 885;       // Y position for Registration Number
    // ══════════════════════════════════════════════════════════

    // Ensure web fonts are fully loaded before rendering on Canvas
    if (document.fonts) {
        await document.fonts.ready;
    }

    ctx.textAlign = 'center';

    // Draw Name
    if (name) {
        ctx.fillStyle = '#0f2942'; // Dark Navy
        let fontSize = 26;
        ctx.font = `italic 700 ${fontSize}px "Montserrat", "Poppins", sans-serif`;

        while (ctx.measureText(name).width > 340 && fontSize > 18) {
            fontSize -= 1;
            ctx.font = `italic 700 ${fontSize}px "Montserrat", "Poppins", sans-serif`;
        }

        ctx.fillText(name.toUpperCase(), textCenterX, nameY);
    }

    // Draw Registration Number
    if (registrationNumber) {
        ctx.fillStyle = '#0f2942'; // Dark Navy
        let regFontSize = 26;
        ctx.font = `italic 700 ${regFontSize}px "Montserrat", "Poppins", sans-serif`;
        ctx.fillText(`${registrationNumber.toUpperCase()}`, textCenterX, regNoY);
    }

    // Return final image as data URL
    return canvas.toDataURL('image/png', 1.0);
}

/**
 * Get template image path
 * @returns {string} Path to template image
 */
export function getTemplateImage() {
    return '/student_coordinator.jpeg';
}