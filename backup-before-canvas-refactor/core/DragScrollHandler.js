// core/DragScrollHandler.js
class DragScrollHandler {
    constructor(element, homeMaster, elementId, profileName = 'defaultProfile') {
        if (!element || !homeMaster || !elementId) {
            console.error('DragScrollHandler: Missing required arguments (element, homeMaster, elementId).');
            return;
        }
        this.element = element;
        this.homeMaster = homeMaster;
        this.elementId = elementId;
        this.profileName = profileName;

        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.lastMoveX = 0;
        this.lastMoveY = 0;
        this.lastMoveTime = 0;

        // Bind methods to maintain 'this' context
        this._onDragStart = this._onDragStart.bind(this);
        this._onDragMove = this._onDragMove.bind(this);
        this._onDragEnd = this._onDragEnd.bind(this);

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.element.addEventListener('mousedown', this._onDragStart, { passive: false });
        document.addEventListener('mousemove', this._onDragMove, { passive: false }); // Listen on document for move
        document.addEventListener('mouseup', this._onDragEnd, { passive: false });   // Listen on document for end

        this.element.addEventListener('touchstart', this._onDragStart, { passive: false });
        document.addEventListener('touchmove', this._onDragMove, { passive: false }); // Listen on document for move
        document.addEventListener('touchend', this._onDragEnd, { passive: false });   // Listen on document for end
    }

    _getEventCoordinates(event) {
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
        return { x: event.clientX, y: event.clientY };
    }

    _onDragStart(event) {
        const targetTagName = event.target.tagName.toLowerCase();
        const isInteractiveElement = ['a', 'button', 'input', 'select', 'textarea'].includes(targetTagName);
        const isContentEditable = event.target.isContentEditable;

        // Only prevent default if not an interactive element or contenteditable
        // Allow text selection within contenteditable.
        if (!isInteractiveElement && !isContentEditable && event.cancelable) {
            event.preventDefault();
        }

        // Check drag threshold from HomeMaster's loaded config
        const profile = this.homeMaster.editorConfig?.scrollPhysicsPresets?.profiles?.[this.profileName] ||
                        this.homeMaster.editorConfig?.scrollPhysicsPresets?.defaultProfile ||
                        { dragThreshold: { value: 5 } }; // Fallback

        // This is a simplified threshold check for initiating drag.
        // A more robust way would be to start tracking on mousedown, and only set isDragging = true
        // and call homeMaster after the mouse has moved beyond the threshold.
        // For now, we start drag immediately and HomeMaster can filter if needed.

        const coords = this._getEventCoordinates(event);
        this.isDragging = true; // Set dragging true immediately. HomeMaster could ignore small drags.
        this.startX = coords.x;
        this.startY = coords.y;
        this.lastMoveX = coords.x;
        this.lastMoveY = coords.y;
        this.lastMoveTime = performance.now();

        document.body.classList.add('no-select-during-drag');

        this.homeMaster.handleScrollInteraction('dragScrollStart', {
            elementId: this.elementId,
            profileName: this.profileName,
            startX: this.startX,
            startY: this.startY
        });
    }

    _onDragMove(event) {
        if (!this.isDragging) return;
        // Prevent default scrolling/text selection ONLY if we are actively dragging this element.
        if (this.homeMaster.masterState.activeDragScrollElementId === this.elementId && event.cancelable) {
            event.preventDefault();
        }

        const coords = this._getEventCoordinates(event);

        this.homeMaster.handleScrollInteraction('dragScrollMove', {
            elementId: this.elementId,
            currentX: coords.x,
            currentY: coords.y
        });

        // Note: lastMoveX/Y/Time are now primarily managed within HomeMaster if needed for velocity calc.
        // This class's local copies are mostly for internal reference if any logic here needed them.
    }

    _onDragEnd(event) {
        if (!this.isDragging) return;
        // No preventDefault for mouseup/touchend to allow clicks after drag.

        this.isDragging = false;
        document.body.classList.remove('no-select-during-drag');

        this.homeMaster.handleScrollInteraction('dragScrollEnd', {
            elementId: this.elementId
            // Velocities for momentum are now calculated and handled by HomeMaster based on move events.
        });
    }

    destroy() {
        this.element.removeEventListener('mousedown', this._onDragStart);
        document.removeEventListener('mousemove', this._onDragMove);
        document.removeEventListener('mouseup', this._onDragEnd);

        this.element.removeEventListener('touchstart', this._onDragStart);
        document.removeEventListener('touchmove', this._onDragMove);
        document.removeEventListener('touchend', this._onDragEnd);

        document.body.classList.remove('no-select-during-drag');
        console.log(`DragScrollHandler for ${this.elementId} destroyed.`);
    }
}

// If this file were to be used as a module:
// export default DragScrollHandler;
// For now, it will be included via a <script> tag in vib3code-morphing-blog.html
// and DragScrollHandler will be available globally or within the script's scope.
