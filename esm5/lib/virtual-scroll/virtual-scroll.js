/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ContentChild, ElementRef, EventEmitter, Inject, Optional, Input, NgModule, NgZone, Output, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core/core';
import { PLATFORM_ID } from '@angular/core/core';
import { isPlatformServer } from '@angular/common/common';
import { CommonModule } from '@angular/common/common';
import * as tween from '@tweenjs/tween.js';
/**
 * @return {?}
 */
export function VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY() {
    return {
        scrollThrottlingTime: 0,
        scrollDebounceTime: 0,
        scrollAnimationTime: 750,
        checkResizeInterval: 1000,
        resizeBypassRefreshThreshold: 5,
        modifyOverflowStyleOfParentScroll: true,
        stripedTable: false
    };
}
var VirtualScrollerComponent = /** @class */ (function () {
    function VirtualScrollerComponent(element, renderer, zone, changeDetectorRef, platformId, options) {
        this.element = element;
        this.renderer = renderer;
        this.zone = zone;
        this.changeDetectorRef = changeDetectorRef;
        this.window = window;
        this.executeRefreshOutsideAngularZone = false;
        this._enableUnequalChildrenSizes = false;
        this.useMarginInsteadOfTranslate = false;
        this.ssrViewportWidth = 1920;
        this.ssrViewportHeight = 1080;
        this._bufferAmount = 0;
        this._items = [];
        this.compareItems = (/**
         * @param {?} item1
         * @param {?} item2
         * @return {?}
         */
        function (item1, item2) { return item1 === item2; });
        this.vsUpdate = new EventEmitter();
        this.vsChange = new EventEmitter();
        this.vsStart = new EventEmitter();
        this.vsEnd = new EventEmitter();
        this.calculatedScrollbarWidth = 0;
        this.calculatedScrollbarHeight = 0;
        this.padding = 0;
        this.previousViewPort = (/** @type {?} */ ({}));
        this.cachedPageSize = 0;
        this.previousScrollNumberElements = 0;
        this.isAngularUniversalSSR = isPlatformServer(platformId);
        this.scrollThrottlingTime = options.scrollThrottlingTime;
        this.scrollDebounceTime = options.scrollDebounceTime;
        this.scrollAnimationTime = options.scrollAnimationTime;
        this.scrollbarWidth = options.scrollbarWidth;
        this.scrollbarHeight = options.scrollbarHeight;
        this.checkResizeInterval = options.checkResizeInterval;
        this.resizeBypassRefreshThreshold = options.resizeBypassRefreshThreshold;
        this.modifyOverflowStyleOfParentScroll = options.modifyOverflowStyleOfParentScroll;
        this.stripedTable = options.stripedTable;
        this.horizontal = false;
        this.resetWrapGroupDimensions();
    }
    Object.defineProperty(VirtualScrollerComponent.prototype, "viewPortInfo", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var pageInfo = this.previousViewPort || (/** @type {?} */ ({}));
            return {
                startIndex: pageInfo.startIndex || 0,
                endIndex: pageInfo.endIndex || 0,
                scrollStartPosition: pageInfo.scrollStartPosition || 0,
                scrollEndPosition: pageInfo.scrollEndPosition || 0,
                maxScrollPosition: pageInfo.maxScrollPosition || 0,
                startIndexWithBuffer: pageInfo.startIndexWithBuffer || 0,
                endIndexWithBuffer: pageInfo.endIndexWithBuffer || 0
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "enableUnequalChildrenSizes", {
        get: /**
         * @return {?}
         */
        function () {
            return this._enableUnequalChildrenSizes;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._enableUnequalChildrenSizes === value) {
                return;
            }
            this._enableUnequalChildrenSizes = value;
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "bufferAmount", {
        get: /**
         * @return {?}
         */
        function () {
            if (typeof (this._bufferAmount) === 'number' && this._bufferAmount >= 0) {
                return this._bufferAmount;
            }
            else {
                return this.enableUnequalChildrenSizes ? 5 : 0;
            }
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._bufferAmount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "scrollThrottlingTime", {
        get: /**
         * @return {?}
         */
        function () {
            return this._scrollThrottlingTime;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._scrollThrottlingTime = value;
            this.updateOnScrollFunction();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "scrollDebounceTime", {
        get: /**
         * @return {?}
         */
        function () {
            return this._scrollDebounceTime;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._scrollDebounceTime = value;
            this.updateOnScrollFunction();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.updateOnScrollFunction = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this_1 = this;
        if (this.scrollDebounceTime) {
            this.onScroll = (/** @type {?} */ (this.debounce((/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            }), this.scrollDebounceTime)));
        }
        else if (this.scrollThrottlingTime) {
            this.onScroll = (/** @type {?} */ (this.throttleTrailing((/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            }), this.scrollThrottlingTime)));
        }
        else {
            this.onScroll = (/**
             * @return {?}
             */
            function () {
                _this_1.refresh_internal(false);
            });
        }
    };
    Object.defineProperty(VirtualScrollerComponent.prototype, "checkResizeInterval", {
        get: /**
         * @return {?}
         */
        function () {
            return this._checkResizeInterval;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._checkResizeInterval === value) {
                return;
            }
            this._checkResizeInterval = value;
            this.addScrollEventHandlers();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "items", {
        get: /**
         * @return {?}
         */
        function () {
            return this._items;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (value === this._items) {
                return;
            }
            this._items = value || [];
            this.refresh_internal(true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualScrollerComponent.prototype, "horizontal", {
        get: /**
         * @return {?}
         */
        function () {
            return this._horizontal;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._horizontal = value;
            this.updateDirection();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.revertParentOverscroll = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        if (scrollElement && this.oldParentScrollOverflow) {
            scrollElement.style['overflow-y'] = this.oldParentScrollOverflow.y;
            scrollElement.style['overflow-x'] = this.oldParentScrollOverflow.x;
        }
        this.oldParentScrollOverflow = undefined;
    };
    Object.defineProperty(VirtualScrollerComponent.prototype, "parentScroll", {
        get: /**
         * @return {?}
         */
        function () {
            return this._parentScroll;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            if (this._parentScroll === value) {
                return;
            }
            this.revertParentOverscroll();
            this._parentScroll = value;
            this.addScrollEventHandlers();
            /** @type {?} */
            var scrollElement = this.getScrollElement();
            if (this.modifyOverflowStyleOfParentScroll && scrollElement !== this.element.nativeElement) {
                this.oldParentScrollOverflow = { x: scrollElement.style['overflow-x'], y: scrollElement.style['overflow-y'] };
                scrollElement.style['overflow-y'] = this.horizontal ? 'visible' : 'auto';
                scrollElement.style['overflow-x'] = this.horizontal ? 'auto' : 'visible';
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.addScrollEventHandlers();
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.removeScrollEventHandlers();
        this.revertParentOverscroll();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var indexLengthChanged = this.cachedItemsLength !== this.items.length;
        this.cachedItemsLength = this.items.length;
        /** @type {?} */
        var firstRun = !changes.items || !changes.items.previousValue || changes.items.previousValue.length === 0;
        this.refresh_internal(indexLengthChanged || firstRun);
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        if (this.cachedItemsLength !== this.items.length) {
            this.cachedItemsLength = this.items.length;
            this.refresh_internal(true);
            return;
        }
        if (this.previousViewPort && this.viewPortItems && this.viewPortItems.length > 0) {
            /** @type {?} */
            var itemsArrayChanged = false;
            for (var i = 0; i < this.viewPortItems.length; ++i) {
                if (!this.compareItems(this.items[this.previousViewPort.startIndexWithBuffer + i], this.viewPortItems[i])) {
                    itemsArrayChanged = true;
                    break;
                }
            }
            if (itemsArrayChanged) {
                this.refresh_internal(true);
            }
        }
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.refresh = /**
     * @return {?}
     */
    function () {
        this.refresh_internal(true);
    };
    /**
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateAllCachedMeasurements = /**
     * @return {?}
     */
    function () {
        this.wrapGroupDimensions = {
            maxChildSizePerWrapGroup: [],
            numberOfKnownWrapGroupChildSizes: 0,
            sumOfKnownWrapGroupChildWidths: 0,
            sumOfKnownWrapGroupChildHeights: 0
        };
        this.minMeasuredChildWidth = undefined;
        this.minMeasuredChildHeight = undefined;
        this.refresh_internal(false);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateCachedMeasurementForItem = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var index = this.items && this.items.indexOf(item);
            if (index >= 0) {
                this.invalidateCachedMeasurementAtIndex(index);
            }
        }
        else {
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        }
        this.refresh_internal(false);
    };
    /**
     * @param {?} index
     * @return {?}
     */
    VirtualScrollerComponent.prototype.invalidateCachedMeasurementAtIndex = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var cachedMeasurement = this.wrapGroupDimensions.maxChildSizePerWrapGroup[index];
            if (cachedMeasurement) {
                this.wrapGroupDimensions.maxChildSizePerWrapGroup[index] = undefined;
                --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= cachedMeasurement.childWidth || 0;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= cachedMeasurement.childHeight || 0;
            }
        }
        else {
            this.minMeasuredChildWidth = undefined;
            this.minMeasuredChildHeight = undefined;
        }
        this.refresh_internal(false);
    };
    /**
     * @param {?} item
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollInto = /**
     * @param {?} item
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (item, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        /** @type {?} */
        var index = this.items.indexOf(item);
        if (index === -1) {
            return;
        }
        this.scrollToIndex(index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback);
    };
    /**
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToIndex = /**
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        var _this_1 = this;
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        /** @type {?} */
        var maxRetries = 5;
        /** @type {?} */
        var retryIfNeeded = (/**
         * @return {?}
         */
        function () {
            --maxRetries;
            if (maxRetries <= 0) {
                if (animationCompletedCallback) {
                    animationCompletedCallback();
                }
                return;
            }
            /** @type {?} */
            var dimensions = _this_1.calculateDimensions();
            /** @type {?} */
            var desiredStartIndex = Math.min(Math.max(index, 0), dimensions.itemCount - 1);
            if (_this_1.previousViewPort.startIndex === desiredStartIndex) {
                if (animationCompletedCallback) {
                    animationCompletedCallback();
                }
                return;
            }
            _this_1.scrollToIndex_internal(index, alignToBeginning, additionalOffset, 0, retryIfNeeded);
        });
        this.scrollToIndex_internal(index, alignToBeginning, additionalOffset, animationMilliseconds, retryIfNeeded);
    };
    /**
     * @protected
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToIndex_internal = /**
     * @protected
     * @param {?} index
     * @param {?=} alignToBeginning
     * @param {?=} additionalOffset
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (index, alignToBeginning, additionalOffset, animationMilliseconds, animationCompletedCallback) {
        if (alignToBeginning === void 0) { alignToBeginning = true; }
        if (additionalOffset === void 0) { additionalOffset = 0; }
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        animationMilliseconds = animationMilliseconds === undefined ? this.scrollAnimationTime : animationMilliseconds;
        /** @type {?} */
        var dimensions = this.calculateDimensions();
        /** @type {?} */
        var scroll = this.calculatePadding(index, dimensions) + additionalOffset;
        if (!alignToBeginning) {
            scroll -= dimensions.wrapGroupsPerPage * dimensions[this._childScrollDim];
        }
        this.scrollToPosition(scroll, animationMilliseconds, animationCompletedCallback);
    };
    /**
     * @param {?} scrollPosition
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    VirtualScrollerComponent.prototype.scrollToPosition = /**
     * @param {?} scrollPosition
     * @param {?=} animationMilliseconds
     * @param {?=} animationCompletedCallback
     * @return {?}
     */
    function (scrollPosition, animationMilliseconds, animationCompletedCallback) {
        var _this_1 = this;
        if (animationMilliseconds === void 0) { animationMilliseconds = undefined; }
        if (animationCompletedCallback === void 0) { animationCompletedCallback = undefined; }
        scrollPosition += this.getElementsOffset();
        animationMilliseconds = animationMilliseconds === undefined ? this.scrollAnimationTime : animationMilliseconds;
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        /** @type {?} */
        var animationRequest;
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = undefined;
        }
        if (!animationMilliseconds) {
            this.renderer.setProperty(scrollElement, this._scrollType, scrollPosition);
            this.refresh_internal(false, animationCompletedCallback);
            return;
        }
        /** @type {?} */
        var tweenConfigObj = { scrollPosition: scrollElement[this._scrollType] };
        /** @type {?} */
        var newTween = new tween.Tween(tweenConfigObj)
            .to({ scrollPosition: scrollPosition }, animationMilliseconds)
            .easing(tween.Easing.Quadratic.Out)
            .onUpdate((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            if (isNaN(data.scrollPosition)) {
                return;
            }
            _this_1.renderer.setProperty(scrollElement, _this_1._scrollType, data.scrollPosition);
            _this_1.refresh_internal(false);
        }))
            .onStop((/**
         * @return {?}
         */
        function () {
            cancelAnimationFrame(animationRequest);
        }))
            .start();
        /** @type {?} */
        var animate = (/**
         * @param {?=} time
         * @return {?}
         */
        function (time) {
            if (!newTween["isPlaying"]()) {
                return;
            }
            newTween.update(time);
            if (tweenConfigObj.scrollPosition === scrollPosition) {
                _this_1.refresh_internal(false, animationCompletedCallback);
                return;
            }
            _this_1.zone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                animationRequest = requestAnimationFrame(animate);
            }));
        });
        animate();
        this.currentTween = newTween;
    };
    /**
     * @protected
     * @param {?} element
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getElementSize = /**
     * @protected
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var result = element.getBoundingClientRect();
        /** @type {?} */
        var styles = getComputedStyle(element);
        /** @type {?} */
        var marginTop = parseInt(styles['margin-top'], 10) || 0;
        /** @type {?} */
        var marginBottom = parseInt(styles['margin-bottom'], 10) || 0;
        /** @type {?} */
        var marginLeft = parseInt(styles['margin-left'], 10) || 0;
        /** @type {?} */
        var marginRight = parseInt(styles['margin-right'], 10) || 0;
        return {
            top: result.top + marginTop,
            bottom: result.bottom + marginBottom,
            left: result.left + marginLeft,
            right: result.right + marginRight,
            width: result.width + marginLeft + marginRight,
            height: result.height + marginTop + marginBottom
        };
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.checkScrollElementResized = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var boundingRect = this.getElementSize(this.getScrollElement());
        /** @type {?} */
        var sizeChanged;
        if (!this.previousScrollBoundingRect) {
            sizeChanged = true;
        }
        else {
            /** @type {?} */
            var widthChange = Math.abs(boundingRect.width - this.previousScrollBoundingRect.width);
            /** @type {?} */
            var heightChange = Math.abs(boundingRect.height - this.previousScrollBoundingRect.height);
            sizeChanged = widthChange > this.resizeBypassRefreshThreshold || heightChange > this.resizeBypassRefreshThreshold;
        }
        if (sizeChanged) {
            this.previousScrollBoundingRect = boundingRect;
            if (boundingRect.width > 0 && boundingRect.height > 0) {
                this.refresh_internal(false);
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.updateDirection = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.horizontal) {
            this._invisiblePaddingProperty = 'width';
            this._offsetType = 'offsetLeft';
            this._pageOffsetType = 'pageXOffset';
            this._childScrollDim = 'childWidth';
            this._marginDir = 'margin-left';
            this._translateDir = 'translateX';
            this._scrollType = 'scrollLeft';
        }
        else {
            this._invisiblePaddingProperty = 'height';
            this._offsetType = 'offsetTop';
            this._pageOffsetType = 'pageYOffset';
            this._childScrollDim = 'childHeight';
            this._marginDir = 'margin-top';
            this._translateDir = 'translateY';
            this._scrollType = 'scrollTop';
        }
    };
    /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    VirtualScrollerComponent.prototype.debounce = /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    function (func, wait) {
        /** @type {?} */
        var throttled = this.throttleTrailing(func, wait);
        /** @type {?} */
        var result = (/**
         * @return {?}
         */
        function () {
            throttled['cancel']();
            throttled.apply(this, arguments);
        });
        result['cancel'] = (/**
         * @return {?}
         */
        function () {
            throttled['cancel']();
        });
        return result;
    };
    /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    VirtualScrollerComponent.prototype.throttleTrailing = /**
     * @protected
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    function (func, wait) {
        /** @type {?} */
        var timeout = undefined;
        /** @type {?} */
        var _arguments = arguments;
        /** @type {?} */
        var result = (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var _this = this;
            _arguments = arguments;
            if (timeout) {
                return;
            }
            if (wait <= 0) {
                func.apply(_this, _arguments);
            }
            else {
                timeout = setTimeout((/**
                 * @return {?}
                 */
                function () {
                    timeout = undefined;
                    func.apply(_this, _arguments);
                }), wait);
            }
        });
        result['cancel'] = (/**
         * @return {?}
         */
        function () {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        });
        return result;
    };
    /**
     * @protected
     * @param {?} itemsArrayModified
     * @param {?=} refreshCompletedCallback
     * @param {?=} maxRunTimes
     * @return {?}
     */
    VirtualScrollerComponent.prototype.refresh_internal = /**
     * @protected
     * @param {?} itemsArrayModified
     * @param {?=} refreshCompletedCallback
     * @param {?=} maxRunTimes
     * @return {?}
     */
    function (itemsArrayModified, refreshCompletedCallback, maxRunTimes) {
        //note: maxRunTimes is to force it to keep recalculating if the previous iteration caused a re-render (different sliced items in viewport or scrollPosition changed).
        //The default of 2x max will probably be accurate enough without causing too large a performance bottleneck
        //The code would typically quit out on the 2nd iteration anyways. The main time it'd think more than 2 runs would be necessary would be for vastly different sized child items or if this is the 1st time the items array was initialized.
        //Without maxRunTimes, If the user is actively scrolling this code would become an infinite loop until they stopped scrolling. This would be okay, except each scroll event would start an additional infinte loop. We want to short-circuit it to prevent this.
        var _this_1 = this;
        if (refreshCompletedCallback === void 0) { refreshCompletedCallback = undefined; }
        if (maxRunTimes === void 0) { maxRunTimes = 2; }
        if (itemsArrayModified && this.previousViewPort && this.previousViewPort.scrollStartPosition > 0) {
            //if items were prepended, scroll forward to keep same items visible
            /** @type {?} */
            var oldViewPort_1 = this.previousViewPort;
            /** @type {?} */
            var oldViewPortItems_1 = this.viewPortItems;
            /** @type {?} */
            var oldRefreshCompletedCallback_1 = refreshCompletedCallback;
            refreshCompletedCallback = (/**
             * @return {?}
             */
            function () {
                /** @type {?} */
                var scrollLengthDelta = _this_1.previousViewPort.scrollLength - oldViewPort_1.scrollLength;
                if (scrollLengthDelta > 0 && _this_1.viewPortItems) {
                    /** @type {?} */
                    var oldStartItem_1 = oldViewPortItems_1[0];
                    /** @type {?} */
                    var oldStartItemIndex = _this_1.items.findIndex((/**
                     * @param {?} x
                     * @return {?}
                     */
                    function (x) { return _this_1.compareItems(oldStartItem_1, x); }));
                    if (oldStartItemIndex > _this_1.previousViewPort.startIndexWithBuffer) {
                        /** @type {?} */
                        var itemOrderChanged = false;
                        for (var i = 1; i < _this_1.viewPortItems.length; ++i) {
                            if (!_this_1.compareItems(_this_1.items[oldStartItemIndex + i], oldViewPortItems_1[i])) {
                                itemOrderChanged = true;
                                break;
                            }
                        }
                        if (!itemOrderChanged) {
                            _this_1.scrollToPosition(_this_1.previousViewPort.scrollStartPosition + scrollLengthDelta, 0, oldRefreshCompletedCallback_1);
                            return;
                        }
                    }
                }
                if (oldRefreshCompletedCallback_1) {
                    oldRefreshCompletedCallback_1();
                }
            });
        }
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            requestAnimationFrame((/**
             * @return {?}
             */
            function () {
                if (itemsArrayModified) {
                    _this_1.resetWrapGroupDimensions();
                }
                /** @type {?} */
                var viewport = _this_1.calculateViewport();
                /** @type {?} */
                var startChanged = itemsArrayModified || viewport.startIndex !== _this_1.previousViewPort.startIndex;
                /** @type {?} */
                var endChanged = itemsArrayModified || viewport.endIndex !== _this_1.previousViewPort.endIndex;
                /** @type {?} */
                var scrollLengthChanged = viewport.scrollLength !== _this_1.previousViewPort.scrollLength;
                /** @type {?} */
                var paddingChanged = viewport.padding !== _this_1.previousViewPort.padding;
                /** @type {?} */
                var scrollPositionChanged = viewport.scrollStartPosition !== _this_1.previousViewPort.scrollStartPosition || viewport.scrollEndPosition !== _this_1.previousViewPort.scrollEndPosition || viewport.maxScrollPosition !== _this_1.previousViewPort.maxScrollPosition;
                _this_1.previousViewPort = viewport;
                if (scrollLengthChanged) {
                    _this_1.renderer.setStyle(_this_1.invisiblePaddingElementRef.nativeElement, _this_1._invisiblePaddingProperty, viewport.scrollLength + "px");
                }
                if (paddingChanged) {
                    if (_this_1.useMarginInsteadOfTranslate) {
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, _this_1._marginDir, viewport.padding + "px");
                    }
                    else {
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, 'transform', _this_1._translateDir + "(" + viewport.padding + "px)");
                        _this_1.renderer.setStyle(_this_1.contentElementRef.nativeElement, 'webkitTransform', _this_1._translateDir + "(" + viewport.padding + "px)");
                    }
                }
                if (_this_1.headerElementRef) {
                    /** @type {?} */
                    var scrollPosition = _this_1.getScrollElement()[_this_1._scrollType];
                    /** @type {?} */
                    var containerOffset = _this_1.getElementsOffset();
                    /** @type {?} */
                    var offset = Math.max(scrollPosition - viewport.padding - containerOffset + _this_1.headerElementRef.nativeElement.clientHeight, 0);
                    _this_1.renderer.setStyle(_this_1.headerElementRef.nativeElement, 'transform', _this_1._translateDir + "(" + offset + "px)");
                    _this_1.renderer.setStyle(_this_1.headerElementRef.nativeElement, 'webkitTransform', _this_1._translateDir + "(" + offset + "px)");
                }
                /** @type {?} */
                var changeEventArg = (startChanged || endChanged) ? {
                    startIndex: viewport.startIndex,
                    endIndex: viewport.endIndex,
                    scrollStartPosition: viewport.scrollStartPosition,
                    scrollEndPosition: viewport.scrollEndPosition,
                    startIndexWithBuffer: viewport.startIndexWithBuffer,
                    endIndexWithBuffer: viewport.endIndexWithBuffer,
                    maxScrollPosition: viewport.maxScrollPosition
                } : undefined;
                if (startChanged || endChanged || scrollPositionChanged) {
                    /** @type {?} */
                    var handleChanged = (/**
                     * @return {?}
                     */
                    function () {
                        // update the scroll list to trigger re-render of components in viewport
                        _this_1.viewPortItems = viewport.startIndexWithBuffer >= 0 && viewport.endIndexWithBuffer >= 0 ? _this_1.items.slice(viewport.startIndexWithBuffer, viewport.endIndexWithBuffer + 1) : [];
                        _this_1.vsUpdate.emit(_this_1.viewPortItems);
                        if (startChanged) {
                            _this_1.vsStart.emit(changeEventArg);
                        }
                        if (endChanged) {
                            _this_1.vsEnd.emit(changeEventArg);
                        }
                        if (startChanged || endChanged) {
                            _this_1.changeDetectorRef.markForCheck();
                            _this_1.vsChange.emit(changeEventArg);
                        }
                        if (maxRunTimes > 0) {
                            _this_1.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
                            return;
                        }
                        if (refreshCompletedCallback) {
                            refreshCompletedCallback();
                        }
                    });
                    if (_this_1.executeRefreshOutsideAngularZone) {
                        handleChanged();
                    }
                    else {
                        _this_1.zone.run(handleChanged);
                    }
                }
                else {
                    if (maxRunTimes > 0 && (scrollLengthChanged || paddingChanged)) {
                        _this_1.refresh_internal(false, refreshCompletedCallback, maxRunTimes - 1);
                        return;
                    }
                    if (refreshCompletedCallback) {
                        refreshCompletedCallback();
                    }
                }
            }));
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getScrollElement = /**
     * @protected
     * @return {?}
     */
    function () {
        return this.parentScroll instanceof Window ? document.scrollingElement || document.documentElement || document.body : this.parentScroll || this.element.nativeElement;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.addScrollEventHandlers = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this_1 = this;
        if (this.isAngularUniversalSSR) {
            return;
        }
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        this.removeScrollEventHandlers();
        this.zone.runOutsideAngular((/**
         * @return {?}
         */
        function () {
            if (_this_1.parentScroll instanceof Window) {
                _this_1.disposeScrollHandler = _this_1.renderer.listen('window', 'scroll', _this_1.onScroll);
                _this_1.disposeResizeHandler = _this_1.renderer.listen('window', 'resize', _this_1.onScroll);
            }
            else {
                _this_1.disposeScrollHandler = _this_1.renderer.listen(scrollElement, 'scroll', _this_1.onScroll);
                if (_this_1._checkResizeInterval > 0) {
                    _this_1.checkScrollElementResizedTimer = (/** @type {?} */ (setInterval((/**
                     * @return {?}
                     */
                    function () { _this_1.checkScrollElementResized(); }), _this_1._checkResizeInterval)));
                }
            }
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.removeScrollEventHandlers = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.checkScrollElementResizedTimer) {
            clearInterval(this.checkScrollElementResizedTimer);
        }
        if (this.disposeScrollHandler) {
            this.disposeScrollHandler();
            this.disposeScrollHandler = undefined;
        }
        if (this.disposeResizeHandler) {
            this.disposeResizeHandler();
            this.disposeResizeHandler = undefined;
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getElementsOffset = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.isAngularUniversalSSR) {
            return 0;
        }
        /** @type {?} */
        var offset = 0;
        if (this.containerElementRef && this.containerElementRef.nativeElement) {
            offset += this.containerElementRef.nativeElement[this._offsetType];
        }
        if (this.parentScroll) {
            /** @type {?} */
            var scrollElement = this.getScrollElement();
            /** @type {?} */
            var elementClientRect = this.getElementSize(this.element.nativeElement);
            /** @type {?} */
            var scrollClientRect = this.getElementSize(scrollElement);
            if (this.horizontal) {
                offset += elementClientRect.left - scrollClientRect.left;
            }
            else {
                offset += elementClientRect.top - scrollClientRect.top;
            }
            if (!(this.parentScroll instanceof Window)) {
                offset += scrollElement[this._scrollType];
            }
        }
        return offset;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.countItemsPerWrapGroup = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.isAngularUniversalSSR) {
            return Math.round(this.horizontal ? this.ssrViewportHeight / this.ssrChildHeight : this.ssrViewportWidth / this.ssrChildWidth);
        }
        /** @type {?} */
        var propertyName = this.horizontal ? 'offsetLeft' : 'offsetTop';
        /** @type {?} */
        var children = ((this.containerElementRef && this.containerElementRef.nativeElement) || this.contentElementRef.nativeElement).children;
        /** @type {?} */
        var childrenLength = children ? children.length : 0;
        if (childrenLength === 0) {
            return 1;
        }
        /** @type {?} */
        var firstOffset = children[0][propertyName];
        /** @type {?} */
        var result = 1;
        while (result < childrenLength && firstOffset === children[result][propertyName]) {
            ++result;
        }
        return result;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.getScrollStartPosition = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var windowScrollValue = undefined;
        if (this.parentScroll instanceof Window) {
            windowScrollValue = window[this._pageOffsetType];
        }
        return windowScrollValue || this.getScrollElement()[this._scrollType] || 0;
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.resetWrapGroupDimensions = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var oldWrapGroupDimensions = this.wrapGroupDimensions;
        this.invalidateAllCachedMeasurements();
        if (!this.enableUnequalChildrenSizes || !oldWrapGroupDimensions || oldWrapGroupDimensions.numberOfKnownWrapGroupChildSizes === 0) {
            return;
        }
        /** @type {?} */
        var itemsPerWrapGroup = this.countItemsPerWrapGroup();
        for (var wrapGroupIndex = 0; wrapGroupIndex < oldWrapGroupDimensions.maxChildSizePerWrapGroup.length; ++wrapGroupIndex) {
            /** @type {?} */
            var oldWrapGroupDimension = oldWrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
            if (!oldWrapGroupDimension || !oldWrapGroupDimension.items || !oldWrapGroupDimension.items.length) {
                continue;
            }
            if (oldWrapGroupDimension.items.length !== itemsPerWrapGroup) {
                return;
            }
            /** @type {?} */
            var itemsChanged = false;
            /** @type {?} */
            var arrayStartIndex = itemsPerWrapGroup * wrapGroupIndex;
            for (var i = 0; i < itemsPerWrapGroup; ++i) {
                if (!this.compareItems(oldWrapGroupDimension.items[i], this.items[arrayStartIndex + i])) {
                    itemsChanged = true;
                    break;
                }
            }
            if (!itemsChanged) {
                ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += oldWrapGroupDimension.childWidth || 0;
                this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += oldWrapGroupDimension.childHeight || 0;
                this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = oldWrapGroupDimension;
            }
        }
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculateDimensions = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var scrollElement = this.getScrollElement();
        /** @type {?} */
        var maxCalculatedScrollBarSize = 25;
        this.calculatedScrollbarHeight = Math.max(Math.min(scrollElement.offsetHeight - scrollElement.clientHeight, maxCalculatedScrollBarSize), this.calculatedScrollbarHeight);
        this.calculatedScrollbarWidth = Math.max(Math.min(scrollElement.offsetWidth - scrollElement.clientWidth, maxCalculatedScrollBarSize), this.calculatedScrollbarWidth);
        /** @type {?} */
        var viewportWidth = scrollElement.offsetWidth - (this.scrollbarWidth || this.calculatedScrollbarWidth || (this.horizontal ? 0 : maxCalculatedScrollBarSize));
        /** @type {?} */
        var viewportHeight = scrollElement.offsetHeight - (this.scrollbarHeight || this.calculatedScrollbarHeight || (this.horizontal ? maxCalculatedScrollBarSize : 0));
        /** @type {?} */
        var content = (this.containerElementRef && this.containerElementRef.nativeElement) || this.contentElementRef.nativeElement;
        /** @type {?} */
        var itemsPerWrapGroup = this.countItemsPerWrapGroup();
        /** @type {?} */
        var wrapGroupsPerPage;
        /** @type {?} */
        var defaultChildWidth;
        /** @type {?} */
        var defaultChildHeight;
        if (this.isAngularUniversalSSR) {
            viewportWidth = this.ssrViewportWidth;
            viewportHeight = this.ssrViewportHeight;
            defaultChildWidth = this.ssrChildWidth;
            defaultChildHeight = this.ssrChildHeight;
            /** @type {?} */
            var itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
            /** @type {?} */
            var itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
            wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
        }
        else if (!this.enableUnequalChildrenSizes) {
            if (content.children.length > 0) {
                if (!this.childWidth || !this.childHeight) {
                    if (!this.minMeasuredChildWidth && viewportWidth > 0) {
                        this.minMeasuredChildWidth = viewportWidth;
                    }
                    if (!this.minMeasuredChildHeight && viewportHeight > 0) {
                        this.minMeasuredChildHeight = viewportHeight;
                    }
                }
                /** @type {?} */
                var child = content.children[0];
                /** @type {?} */
                var clientRect = this.getElementSize(child);
                this.minMeasuredChildWidth = Math.min(this.minMeasuredChildWidth, clientRect.width);
                this.minMeasuredChildHeight = Math.min(this.minMeasuredChildHeight, clientRect.height);
            }
            defaultChildWidth = this.childWidth || this.minMeasuredChildWidth || viewportWidth;
            defaultChildHeight = this.childHeight || this.minMeasuredChildHeight || viewportHeight;
            /** @type {?} */
            var itemsPerRow = Math.max(Math.ceil(viewportWidth / defaultChildWidth), 1);
            /** @type {?} */
            var itemsPerCol = Math.max(Math.ceil(viewportHeight / defaultChildHeight), 1);
            wrapGroupsPerPage = this.horizontal ? itemsPerRow : itemsPerCol;
        }
        else {
            /** @type {?} */
            var scrollOffset = scrollElement[this._scrollType] - (this.previousViewPort ? this.previousViewPort.padding : 0);
            /** @type {?} */
            var arrayStartIndex = this.previousViewPort.startIndexWithBuffer || 0;
            /** @type {?} */
            var wrapGroupIndex = Math.ceil(arrayStartIndex / itemsPerWrapGroup);
            /** @type {?} */
            var maxWidthForWrapGroup = 0;
            /** @type {?} */
            var maxHeightForWrapGroup = 0;
            /** @type {?} */
            var sumOfVisibleMaxWidths = 0;
            /** @type {?} */
            var sumOfVisibleMaxHeights = 0;
            wrapGroupsPerPage = 0;
            for (var i = 0; i < content.children.length; ++i) {
                ++arrayStartIndex;
                /** @type {?} */
                var child = content.children[i];
                /** @type {?} */
                var clientRect = this.getElementSize(child);
                maxWidthForWrapGroup = Math.max(maxWidthForWrapGroup, clientRect.width);
                maxHeightForWrapGroup = Math.max(maxHeightForWrapGroup, clientRect.height);
                if (arrayStartIndex % itemsPerWrapGroup === 0) {
                    /** @type {?} */
                    var oldValue = this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex];
                    if (oldValue) {
                        --this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                        this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths -= oldValue.childWidth || 0;
                        this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights -= oldValue.childHeight || 0;
                    }
                    ++this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
                    /** @type {?} */
                    var items = this.items.slice(arrayStartIndex - itemsPerWrapGroup, arrayStartIndex);
                    this.wrapGroupDimensions.maxChildSizePerWrapGroup[wrapGroupIndex] = {
                        childWidth: maxWidthForWrapGroup,
                        childHeight: maxHeightForWrapGroup,
                        items: items
                    };
                    this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths += maxWidthForWrapGroup;
                    this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights += maxHeightForWrapGroup;
                    if (this.horizontal) {
                        /** @type {?} */
                        var maxVisibleWidthForWrapGroup = Math.min(maxWidthForWrapGroup, Math.max(viewportWidth - sumOfVisibleMaxWidths, 0));
                        if (scrollOffset > 0) {
                            /** @type {?} */
                            var scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleWidthForWrapGroup);
                            maxVisibleWidthForWrapGroup -= scrollOffsetToRemove;
                            scrollOffset -= scrollOffsetToRemove;
                        }
                        sumOfVisibleMaxWidths += maxVisibleWidthForWrapGroup;
                        if (maxVisibleWidthForWrapGroup > 0 && viewportWidth >= sumOfVisibleMaxWidths) {
                            ++wrapGroupsPerPage;
                        }
                    }
                    else {
                        /** @type {?} */
                        var maxVisibleHeightForWrapGroup = Math.min(maxHeightForWrapGroup, Math.max(viewportHeight - sumOfVisibleMaxHeights, 0));
                        if (scrollOffset > 0) {
                            /** @type {?} */
                            var scrollOffsetToRemove = Math.min(scrollOffset, maxVisibleHeightForWrapGroup);
                            maxVisibleHeightForWrapGroup -= scrollOffsetToRemove;
                            scrollOffset -= scrollOffsetToRemove;
                        }
                        sumOfVisibleMaxHeights += maxVisibleHeightForWrapGroup;
                        if (maxVisibleHeightForWrapGroup > 0 && viewportHeight >= sumOfVisibleMaxHeights) {
                            ++wrapGroupsPerPage;
                        }
                    }
                    ++wrapGroupIndex;
                    maxWidthForWrapGroup = 0;
                    maxHeightForWrapGroup = 0;
                }
            }
            /** @type {?} */
            var averageChildWidth = this.wrapGroupDimensions.sumOfKnownWrapGroupChildWidths / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
            /** @type {?} */
            var averageChildHeight = this.wrapGroupDimensions.sumOfKnownWrapGroupChildHeights / this.wrapGroupDimensions.numberOfKnownWrapGroupChildSizes;
            defaultChildWidth = this.childWidth || averageChildWidth || viewportWidth;
            defaultChildHeight = this.childHeight || averageChildHeight || viewportHeight;
            if (this.horizontal) {
                if (viewportWidth > sumOfVisibleMaxWidths) {
                    wrapGroupsPerPage += Math.ceil((viewportWidth - sumOfVisibleMaxWidths) / defaultChildWidth);
                }
            }
            else {
                if (viewportHeight > sumOfVisibleMaxHeights) {
                    wrapGroupsPerPage += Math.ceil((viewportHeight - sumOfVisibleMaxHeights) / defaultChildHeight);
                }
            }
        }
        /** @type {?} */
        var itemCount = this.items.length;
        /** @type {?} */
        var itemsPerPage = itemsPerWrapGroup * wrapGroupsPerPage;
        /** @type {?} */
        var pageCount_fractional = itemCount / itemsPerPage;
        /** @type {?} */
        var numberOfWrapGroups = Math.ceil(itemCount / itemsPerWrapGroup);
        /** @type {?} */
        var scrollLength = 0;
        /** @type {?} */
        var defaultScrollLengthPerWrapGroup = this.horizontal ? defaultChildWidth : defaultChildHeight;
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var numUnknownChildSizes = 0;
            for (var i = 0; i < numberOfWrapGroups; ++i) {
                /** @type {?} */
                var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
                if (childSize) {
                    scrollLength += childSize;
                }
                else {
                    ++numUnknownChildSizes;
                }
            }
            scrollLength += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
        }
        else {
            scrollLength = numberOfWrapGroups * defaultScrollLengthPerWrapGroup;
        }
        if (this.headerElementRef) {
            scrollLength += this.headerElementRef.nativeElement.clientHeight;
        }
        /** @type {?} */
        var viewportLength = this.horizontal ? viewportWidth : viewportHeight;
        /** @type {?} */
        var maxScrollPosition = Math.max(scrollLength - viewportLength, 0);
        return {
            itemCount: itemCount,
            itemsPerWrapGroup: itemsPerWrapGroup,
            wrapGroupsPerPage: wrapGroupsPerPage,
            itemsPerPage: itemsPerPage,
            pageCount_fractional: pageCount_fractional,
            childWidth: defaultChildWidth,
            childHeight: defaultChildHeight,
            scrollLength: scrollLength,
            viewportLength: viewportLength,
            maxScrollPosition: maxScrollPosition
        };
    };
    /**
     * @protected
     * @param {?} arrayStartIndexWithBuffer
     * @param {?} dimensions
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculatePadding = /**
     * @protected
     * @param {?} arrayStartIndexWithBuffer
     * @param {?} dimensions
     * @return {?}
     */
    function (arrayStartIndexWithBuffer, dimensions) {
        if (dimensions.itemCount === 0) {
            return 0;
        }
        /** @type {?} */
        var defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
        /** @type {?} */
        var startingWrapGroupIndex = Math.floor(arrayStartIndexWithBuffer / dimensions.itemsPerWrapGroup) || 0;
        if (!this.enableUnequalChildrenSizes) {
            return defaultScrollLengthPerWrapGroup * startingWrapGroupIndex;
        }
        /** @type {?} */
        var numUnknownChildSizes = 0;
        /** @type {?} */
        var result = 0;
        for (var i = 0; i < startingWrapGroupIndex; ++i) {
            /** @type {?} */
            var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
            if (childSize) {
                result += childSize;
            }
            else {
                ++numUnknownChildSizes;
            }
        }
        result += Math.round(numUnknownChildSizes * defaultScrollLengthPerWrapGroup);
        return result;
    };
    /**
     * @protected
     * @param {?} scrollPosition
     * @param {?} dimensions
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculatePageInfo = /**
     * @protected
     * @param {?} scrollPosition
     * @param {?} dimensions
     * @return {?}
     */
    function (scrollPosition, dimensions) {
        /** @type {?} */
        var scrollPercentage = 0;
        if (this.enableUnequalChildrenSizes) {
            /** @type {?} */
            var numberOfWrapGroups = Math.ceil(dimensions.itemCount / dimensions.itemsPerWrapGroup);
            /** @type {?} */
            var totalScrolledLength = 0;
            /** @type {?} */
            var defaultScrollLengthPerWrapGroup = dimensions[this._childScrollDim];
            for (var i = 0; i < numberOfWrapGroups; ++i) {
                /** @type {?} */
                var childSize = this.wrapGroupDimensions.maxChildSizePerWrapGroup[i] && this.wrapGroupDimensions.maxChildSizePerWrapGroup[i][this._childScrollDim];
                if (childSize) {
                    totalScrolledLength += childSize;
                }
                else {
                    totalScrolledLength += defaultScrollLengthPerWrapGroup;
                }
                if (scrollPosition < totalScrolledLength) {
                    scrollPercentage = i / numberOfWrapGroups;
                    break;
                }
            }
        }
        else {
            scrollPercentage = scrollPosition / dimensions.scrollLength;
        }
        /** @type {?} */
        var startingArrayIndex_fractional = Math.min(Math.max(scrollPercentage * dimensions.pageCount_fractional, 0), dimensions.pageCount_fractional) * dimensions.itemsPerPage;
        /** @type {?} */
        var maxStart = dimensions.itemCount - dimensions.itemsPerPage - 1;
        /** @type {?} */
        var arrayStartIndex = Math.min(Math.floor(startingArrayIndex_fractional), maxStart);
        arrayStartIndex -= arrayStartIndex % dimensions.itemsPerWrapGroup; // round down to start of wrapGroup
        if (this.stripedTable) {
            /** @type {?} */
            var bufferBoundary = 2 * dimensions.itemsPerWrapGroup;
            if (arrayStartIndex % bufferBoundary !== 0) {
                arrayStartIndex = Math.max(arrayStartIndex - arrayStartIndex % bufferBoundary, 0);
            }
        }
        /** @type {?} */
        var arrayEndIndex = Math.ceil(startingArrayIndex_fractional) + dimensions.itemsPerPage - 1;
        /** @type {?} */
        var endIndexWithinWrapGroup = (arrayEndIndex + 1) % dimensions.itemsPerWrapGroup;
        if (endIndexWithinWrapGroup > 0) {
            arrayEndIndex += dimensions.itemsPerWrapGroup - endIndexWithinWrapGroup; // round up to end of wrapGroup
        }
        if (isNaN(arrayStartIndex)) {
            arrayStartIndex = 0;
        }
        if (isNaN(arrayEndIndex)) {
            arrayEndIndex = 0;
        }
        arrayStartIndex = Math.min(Math.max(arrayStartIndex, 0), dimensions.itemCount - 1);
        arrayEndIndex = Math.min(Math.max(arrayEndIndex, 0), dimensions.itemCount - 1);
        /** @type {?} */
        var bufferSize = this.bufferAmount * dimensions.itemsPerWrapGroup;
        /** @type {?} */
        var startIndexWithBuffer = Math.min(Math.max(arrayStartIndex - bufferSize, 0), dimensions.itemCount - 1);
        /** @type {?} */
        var endIndexWithBuffer = Math.min(Math.max(arrayEndIndex + bufferSize, 0), dimensions.itemCount - 1);
        return {
            startIndex: arrayStartIndex,
            endIndex: arrayEndIndex,
            startIndexWithBuffer: startIndexWithBuffer,
            endIndexWithBuffer: endIndexWithBuffer,
            scrollStartPosition: scrollPosition,
            scrollEndPosition: scrollPosition + dimensions.viewportLength,
            maxScrollPosition: dimensions.maxScrollPosition
        };
    };
    /**
     * @protected
     * @return {?}
     */
    VirtualScrollerComponent.prototype.calculateViewport = /**
     * @protected
     * @return {?}
     */
    function () {
        /** @type {?} */
        var dimensions = this.calculateDimensions();
        /** @type {?} */
        var offset = this.getElementsOffset();
        /** @type {?} */
        var scrollStartPosition = this.getScrollStartPosition();
        if (scrollStartPosition > (dimensions.scrollLength + offset) && !(this.parentScroll instanceof Window)) {
            scrollStartPosition = dimensions.scrollLength;
        }
        else {
            scrollStartPosition -= offset;
        }
        scrollStartPosition = Math.max(0, scrollStartPosition);
        /** @type {?} */
        var pageInfo = this.calculatePageInfo(scrollStartPosition, dimensions);
        /** @type {?} */
        var newPadding = this.calculatePadding(pageInfo.startIndexWithBuffer, dimensions);
        /** @type {?} */
        var newScrollLength = dimensions.scrollLength;
        return {
            startIndex: pageInfo.startIndex,
            endIndex: pageInfo.endIndex,
            startIndexWithBuffer: pageInfo.startIndexWithBuffer,
            endIndexWithBuffer: pageInfo.endIndexWithBuffer,
            padding: Math.round(newPadding),
            scrollLength: Math.round(newScrollLength),
            scrollStartPosition: pageInfo.scrollStartPosition,
            scrollEndPosition: pageInfo.scrollEndPosition,
            maxScrollPosition: pageInfo.maxScrollPosition
        };
    };
    VirtualScrollerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'virtual-scroller,[virtualScroller]',
                    exportAs: 'virtualScroller',
                    template: "\n    <div class=\"total-padding\" #invisiblePadding></div>\n    <div class=\"scrollable-content\" #content>\n      <ng-content></ng-content>\n    </div>\n  ",
                    host: {
                        '[class.horizontal]': "horizontal",
                        '[class.vertical]': "!horizontal",
                        '[class.selfScroll]': "!parentScroll"
                    },
                    styles: ["\n    :host {\n      position: relative;\n\t  display: block;\n      -webkit-overflow-scrolling: touch;\n    }\n\t\n\t:host.horizontal.selfScroll {\n      overflow-y: visible;\n      overflow-x: auto;\n\t}\n\t:host.vertical.selfScroll {\n      overflow-y: auto;\n      overflow-x: visible;\n\t}\n\t\n    .scrollable-content {\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      max-width: 100vw;\n      max-height: 100vh;\n      position: absolute;\n    }\n\n\t.scrollable-content ::ng-deep > * {\n\t\tbox-sizing: border-box;\n\t}\n\t\n\t:host.horizontal {\n\t\twhite-space: nowrap;\n\t}\n\t\n\t:host.horizontal .scrollable-content {\n\t\tdisplay: flex;\n\t}\n\t\n\t:host.horizontal .scrollable-content ::ng-deep > * {\n\t\tflex-shrink: 0;\n\t\tflex-grow: 0;\n\t\twhite-space: initial;\n\t}\n\t\n    .total-padding {\n      width: 1px;\n      opacity: 0;\n    }\n    \n    :host.horizontal .total-padding {\n      height: 100%;\n    }\n  "]
                }] }
    ];
    /** @nocollapse */
    VirtualScrollerComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['virtual-scroller-default-options',] }] }
    ]; };
    VirtualScrollerComponent.propDecorators = {
        executeRefreshOutsideAngularZone: [{ type: Input }],
        enableUnequalChildrenSizes: [{ type: Input }],
        useMarginInsteadOfTranslate: [{ type: Input }],
        modifyOverflowStyleOfParentScroll: [{ type: Input }],
        stripedTable: [{ type: Input }],
        scrollbarWidth: [{ type: Input }],
        scrollbarHeight: [{ type: Input }],
        childWidth: [{ type: Input }],
        childHeight: [{ type: Input }],
        ssrChildWidth: [{ type: Input }],
        ssrChildHeight: [{ type: Input }],
        ssrViewportWidth: [{ type: Input }],
        ssrViewportHeight: [{ type: Input }],
        bufferAmount: [{ type: Input }],
        scrollAnimationTime: [{ type: Input }],
        resizeBypassRefreshThreshold: [{ type: Input }],
        scrollThrottlingTime: [{ type: Input }],
        scrollDebounceTime: [{ type: Input }],
        checkResizeInterval: [{ type: Input }],
        items: [{ type: Input }],
        compareItems: [{ type: Input }],
        horizontal: [{ type: Input }],
        parentScroll: [{ type: Input }],
        vsUpdate: [{ type: Output }],
        vsChange: [{ type: Output }],
        vsStart: [{ type: Output }],
        vsEnd: [{ type: Output }],
        contentElementRef: [{ type: ViewChild, args: ['content', { read: ElementRef, static: false },] }],
        invisiblePaddingElementRef: [{ type: ViewChild, args: ['invisiblePadding', { read: ElementRef, static: false },] }],
        headerElementRef: [{ type: ContentChild, args: ['header', { read: ElementRef, static: false },] }],
        containerElementRef: [{ type: ContentChild, args: ['container', { read: ElementRef, static: false },] }]
    };
    return VirtualScrollerComponent;
}());
export { VirtualScrollerComponent };
if (false) {
    /** @type {?} */
    VirtualScrollerComponent.prototype.viewPortItems;
    /** @type {?} */
    VirtualScrollerComponent.prototype.window;
    /** @type {?} */
    VirtualScrollerComponent.prototype.executeRefreshOutsideAngularZone;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._enableUnequalChildrenSizes;
    /** @type {?} */
    VirtualScrollerComponent.prototype.useMarginInsteadOfTranslate;
    /** @type {?} */
    VirtualScrollerComponent.prototype.modifyOverflowStyleOfParentScroll;
    /** @type {?} */
    VirtualScrollerComponent.prototype.stripedTable;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollbarWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollbarHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.childWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.childHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrChildWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrChildHeight;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrViewportWidth;
    /** @type {?} */
    VirtualScrollerComponent.prototype.ssrViewportHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._bufferAmount;
    /** @type {?} */
    VirtualScrollerComponent.prototype.scrollAnimationTime;
    /** @type {?} */
    VirtualScrollerComponent.prototype.resizeBypassRefreshThreshold;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollThrottlingTime;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollDebounceTime;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.onScroll;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.checkScrollElementResizedTimer;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._checkResizeInterval;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._items;
    /** @type {?} */
    VirtualScrollerComponent.prototype.compareItems;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._horizontal;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.oldParentScrollOverflow;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._parentScroll;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsUpdate;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsChange;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsStart;
    /** @type {?} */
    VirtualScrollerComponent.prototype.vsEnd;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.contentElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.invisiblePaddingElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.headerElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.containerElementRef;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.isAngularUniversalSSR;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousScrollBoundingRect;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._invisiblePaddingProperty;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._offsetType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._scrollType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._pageOffsetType;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._childScrollDim;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._translateDir;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype._marginDir;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.calculatedScrollbarWidth;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.calculatedScrollbarHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.padding;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousViewPort;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.currentTween;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.cachedItemsLength;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.disposeScrollHandler;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.disposeResizeHandler;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.minMeasuredChildWidth;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.minMeasuredChildHeight;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.wrapGroupDimensions;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.cachedPageSize;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.previousScrollNumberElements;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.element;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.renderer;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.zone;
    /**
     * @type {?}
     * @protected
     */
    VirtualScrollerComponent.prototype.changeDetectorRef;
}
var VirtualScrollerModule = /** @class */ (function () {
    function VirtualScrollerModule() {
    }
    VirtualScrollerModule.decorators = [
        { type: NgModule, args: [{
                    exports: [VirtualScrollerComponent],
                    declarations: [VirtualScrollerComponent],
                    imports: [CommonModule],
                    providers: [
                        {
                            provide: 'virtual-scroller-default-options',
                            useFactory: VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
                        }
                    ]
                },] }
    ];
    return VirtualScrollerModule;
}());
export { VirtualScrollerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlydHVhbC1zY3JvbGwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1tdWx0aXNlbGVjdC1kcm9wZG93bi8iLCJzb3VyY2VzIjpbImxpYi92aXJ0dWFsLXNjcm9sbC92aXJ0dWFsLXNjcm9sbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNOLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sUUFBUSxFQUNSLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUlOLE1BQU0sRUFDTixTQUFTLEVBQ1QsU0FBUyxFQUNULGlCQUFpQixFQUVqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEtBQUssS0FBSyxNQUFNLG1CQUFtQixDQUFBOzs7O0FBYzFDLE1BQU0sVUFBVSx3Q0FBd0M7SUFDdkQsT0FBTztRQUNOLG9CQUFvQixFQUFFLENBQUM7UUFDdkIsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQixtQkFBbUIsRUFBRSxHQUFHO1FBQ3hCLG1CQUFtQixFQUFFLElBQUk7UUFDekIsNEJBQTRCLEVBQUUsQ0FBQztRQUMvQixpQ0FBaUMsRUFBRSxJQUFJO1FBQ3ZDLFlBQVksRUFBRSxLQUFLO0tBQ25CLENBQUM7QUFDSCxDQUFDO0FBWUQ7SUF3ZUMsa0NBQStCLE9BQW1CLEVBQzlCLFFBQW1CLEVBQ25CLElBQVksRUFDckIsaUJBQW9DLEVBQ3pCLFVBQWtCLEVBRXZDLE9BQXNDO1FBTlIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUM5QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLFNBQUksR0FBSixJQUFJLENBQVE7UUFDckIsc0JBQWlCLEdBQWpCLGlCQUFp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Tm5ELGtEQUFxQzs7Ozs7SUFDckMsZ0VBQW1EOzs7OztJQW5tQnZDLDJDQUFzQzs7Ozs7SUFDakQsNENBQXNDOzs7OztJQUN0Qyx3Q0FBK0I7Ozs7O0lBQy9CLHFEQUE4Qzs7QUE4dEJoRDtJQUFBO0lBV3FDLENBQUM7O2dCQVhyQyxRQUFRLFNBQUM7b0JBQ1QsT0FBTyxFQUFFLENBQUMsd0JBQXdCLENBQUM7b0JBQ25DLFlBQVksRUFBRSxDQUFDLHdCQUF3QixDQUFDO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFNBQVMsRUFBRTt3QkFDVjs0QkFDQyxPQUFPLEVBQUUsa0NBQWtDOzRCQUMzQyxVQUFVLEVBQUUsd0NBQXdDO3lCQUNwRDtxQkFDRDtpQkFDRDs7SUFDb0MsNEJBQUM7Q0FBQSxBQVh0QyxJQVdzQztTQUF6QixxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRDb21wb25lbnQsXG5cdENvbnRlbnRDaGlsZCxcblx0RWxlbWVudFJlZixcblx0RXZlbnRFbWl0dGVyLFxuXHRJbmplY3QsXG5cdE9wdGlvbmFsLFxuXHRJbnB1dCxcblx0TmdNb2R1bGUsXG5cdE5nWm9uZSxcblx0T25DaGFuZ2VzLFxuXHRPbkRlc3Ryb3ksXG5cdE9uSW5pdCxcblx0T3V0cHV0LFxuXHRSZW5kZXJlcjIsXG5cdFZpZXdDaGlsZCxcblx0Q2hhbmdlRGV0ZWN0b3JSZWYsXG5cdEluamVjdGlvblRva2VuXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVNlcnZlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCAqIGFzIHR3ZWVuIGZyb20gJ0B0d2VlbmpzL3R3ZWVuLmpzJ1xuaW1wb3J0IHsgVmlydHVhbFNjcm9sbGVyRGVmYXVsdE9wdGlvbnMgfSBmcm9tICcuL2RlZmF1bHRvcHRpb25zJztcbmltcG9ydCB7IElQYWdlSW5mbyB9IGZyb20gJy4vaXBhZ2VpbmZvJztcbmltcG9ydCB7IElWaWV3cG9ydCB9IGZyb20gJy4vaXZpZXdwb3J0JztcblxuaW1wb3J0IHsgV3JhcEdyb3VwRGltZW5zaW9ucyB9IGZyb20gJy4vd3JhcGdyb3VwZGltZW5zaW9ucyc7XG5pbXBvcnQgeyBXcmFwR3JvdXBEaW1lbnNpb24gfSBmcm9tICcuL3dyYXBncm91cGRpbWVuc2lvbic7XG5cbmltcG9ydCB7IElEaW1lbnNpb25zIH0gZnJvbSAnLi9pZGltZW5zaW9uJztcblxuIFxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIFZJUlRVQUxfU0NST0xMRVJfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogVmlydHVhbFNjcm9sbGVyRGVmYXVsdE9wdGlvbnMge1xuXHRyZXR1cm4ge1xuXHRcdHNjcm9sbFRocm90dGxpbmdUaW1lOiAwLFxuXHRcdHNjcm9sbERlYm91bmNlVGltZTogMCxcblx0XHRzY3JvbGxBbmltYXRpb25UaW1lOiA3NTAsXG5cdFx0Y2hlY2tSZXNpemVJbnRlcnZhbDogMTAwMCxcblx0XHRyZXNpemVCeXBhc3NSZWZyZXNoVGhyZXNob2xkOiA1LFxuXHRcdG1vZGlmeU92ZXJmbG93U3R5bGVPZlBhcmVudFNjcm9sbDogdHJ1ZSxcblx0XHRzdHJpcGVkVGFibGU6IGZhbHNlXG5cdH07XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuQENvbXBvbmVudCh7XG5cdHNlbGVjdG9yOiAndmlydHVhbC1zY3JvbGxlcixbdmlydHVhbFNjcm9sbGVyXScsXG5cdGV4cG9ydEFzOiAndmlydHVhbFNjcm9sbGVyJyxcblx0dGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwidG90YWwtcGFkZGluZ1wiICNpbnZpc2libGVQYWRkaW5nPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzY3JvbGxhYmxlLWNvbnRlbnRcIiAjY29udGVudD5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcblx0aG9zdDoge1xuXHRcdCdbY2xhc3MuaG9yaXpvbnRhbF0nOiBcImhvcml6b250YWxcIixcblx0XHQnW2NsYXNzLnZlcnRpY2FsXSc6IFwiIWhvcml6b250YWxcIixcblx0XHQnW2NsYXNzLnNlbGZTY3JvbGxdJzogXCIhcGFyZW50U2Nyb2xsXCJcblx0fSxcblx0c3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0ICBkaXNwbGF5OiBibG9jaztcbiAgICAgIC13ZWJraXQtb3ZlcmZsb3ctc2Nyb2xsaW5nOiB0b3VjaDtcbiAgICB9XG5cdFxuXHQ6aG9zdC5ob3Jpem9udGFsLnNlbGZTY3JvbGwge1xuICAgICAgb3ZlcmZsb3cteTogdmlzaWJsZTtcbiAgICAgIG92ZXJmbG93LXg6IGF1dG87XG5cdH1cblx0Omhvc3QudmVydGljYWwuc2VsZlNjcm9sbCB7XG4gICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgICAgb3ZlcmZsb3cteDogdmlzaWJsZTtcblx0fVxuXHRcbiAgICAuc2Nyb2xsYWJsZS1jb250ZW50IHtcbiAgICAgIHRvcDogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG1heC13aWR0aDogMTAwdnc7XG4gICAgICBtYXgtaGVpZ2h0OiAxMDB2aDtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB9XG5cblx0LnNjcm9sbGFibGUtY29udGVudCA6Om5nLWRlZXAgPiAqIHtcblx0XHRib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXHR9XG5cdFxuXHQ6aG9zdC5ob3Jpem9udGFsIHtcblx0XHR3aGl0ZS1zcGFjZTogbm93cmFwO1xuXHR9XG5cdFxuXHQ6aG9zdC5ob3Jpem9udGFsIC5zY3JvbGxhYmxlLWNvbnRlbnQge1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdH1cblx0XG5cdDpob3N0Lmhvcml6b250YWwgLnNjcm9sbGFibGUtY29udGVudCA6Om5nLWRlZXAgPiAqIHtcblx0XHRmbGV4LXNocmluazogMDtcblx0XHRmbGV4LWdyb3c6IDA7XG5cdFx0d2hpdGUtc3BhY2U6IGluaXRpYWw7XG5cdH1cblx0XG4gICAgLnRvdGFsLXBhZGRpbmcge1xuICAgICAgd2lkdGg6IDFweDtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICAgIFxuICAgIDpob3N0Lmhvcml6b250YWwgLnRvdGFsLXBhZGRpbmcge1xuICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cdHB1YmxpYyB2aWV3UG9ydEl0ZW1zOiBhbnlbXTtcblx0cHVibGljIHdpbmRvdyA9IHdpbmRvdztcblxuXHRwdWJsaWMgZ2V0IHZpZXdQb3J0SW5mbygpOiBJUGFnZUluZm8ge1xuXHRcdGxldCBwYWdlSW5mbzogSVZpZXdwb3J0ID0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0IHx8IDxhbnk+e307XG5cdFx0cmV0dXJuIHtcblx0XHRcdHN0YXJ0SW5kZXg6IHBhZ2VJbmZvLnN0YXJ0SW5kZXggfHwgMCxcblx0XHRcdGVuZEluZGV4OiBwYWdlSW5mby5lbmRJbmRleCB8fCAwLFxuXHRcdFx0c2Nyb2xsU3RhcnRQb3NpdGlvbjogcGFnZUluZm8uc2Nyb2xsU3RhcnRQb3NpdGlvbiB8fCAwLFxuXHRcdFx0c2Nyb2xsRW5kUG9zaXRpb246IHBhZ2VJbmZvLnNjcm9sbEVuZFBvc2l0aW9uIHx8IDAsXG5cdFx0XHRtYXhTY3JvbGxQb3NpdGlvbjogcGFnZUluZm8ubWF4U2Nyb2xsUG9zaXRpb24gfHwgMCxcblx0XHRcdHN0YXJ0SW5kZXhXaXRoQnVmZmVyOiBwYWdlSW5mby5zdGFydEluZGV4V2l0aEJ1ZmZlciB8fCAwLFxuXHRcdFx0ZW5kSW5kZXhXaXRoQnVmZmVyOiBwYWdlSW5mby5lbmRJbmRleFdpdGhCdWZmZXIgfHwgMFxuXHRcdH07XG5cdH1cblxuXHRASW5wdXQoKVxuXHRwdWJsaWMgZXhlY3V0ZVJlZnJlc2hPdXRzaWRlQW5ndWxhclpvbmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuXHRwcm90ZWN0ZWQgX2VuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzOiBib29sZWFuID0gZmFsc2U7XG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBnZXQgZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXMoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2VuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzO1xuXHR9XG5cdHB1YmxpYyBzZXQgZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXModmFsdWU6IGJvb2xlYW4pIHtcblx0XHRpZiAodGhpcy5fZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXMgPT09IHZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5fZW5hYmxlVW5lcXVhbENoaWxkcmVuU2l6ZXMgPSB2YWx1ZTtcblx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRIZWlnaHQgPSB1bmRlZmluZWQ7XG5cdH1cblxuXHRASW5wdXQoKVxuXHRwdWJsaWMgdXNlTWFyZ2luSW5zdGVhZE9mVHJhbnNsYXRlOiBib29sZWFuID0gZmFsc2U7XG5cblx0QElucHV0KClcblx0cHVibGljIG1vZGlmeU92ZXJmbG93U3R5bGVPZlBhcmVudFNjcm9sbDogYm9vbGVhbjtcblxuXHRASW5wdXQoKVxuXHRwdWJsaWMgc3RyaXBlZFRhYmxlOiBib29sZWFuO1xuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBzY3JvbGxiYXJXaWR0aDogbnVtYmVyO1xuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBzY3JvbGxiYXJIZWlnaHQ6IG51bWJlcjtcblxuXHRASW5wdXQoKVxuXHRwdWJsaWMgY2hpbGRXaWR0aDogbnVtYmVyO1xuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBjaGlsZEhlaWdodDogbnVtYmVyO1xuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBzc3JDaGlsZFdpZHRoOiBudW1iZXI7XG5cblx0QElucHV0KClcblx0cHVibGljIHNzckNoaWxkSGVpZ2h0OiBudW1iZXI7XG5cblx0QElucHV0KClcblx0cHVibGljIHNzclZpZXdwb3J0V2lkdGg6IG51bWJlciA9IDE5MjA7XG5cblx0QElucHV0KClcblx0cHVibGljIHNzclZpZXdwb3J0SGVpZ2h0OiBudW1iZXIgPSAxMDgwO1xuXG5cdHByb3RlY3RlZCBfYnVmZmVyQW1vdW50OiBudW1iZXIgPSAwO1xuXHRASW5wdXQoKVxuXHRwdWJsaWMgZ2V0IGJ1ZmZlckFtb3VudCgpOiBudW1iZXIge1xuXHRcdGlmICh0eXBlb2YgKHRoaXMuX2J1ZmZlckFtb3VudCkgPT09ICdudW1iZXInICYmIHRoaXMuX2J1ZmZlckFtb3VudCA+PSAwKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fYnVmZmVyQW1vdW50O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcyA/IDUgOiAwO1x0XG5cdFx0fVxuXHR9XG5cdHB1YmxpYyBzZXQgYnVmZmVyQW1vdW50KHZhbHVlOiBudW1iZXIpIHtcblx0XHR0aGlzLl9idWZmZXJBbW91bnQgPSB2YWx1ZTtcblx0fVxuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBzY3JvbGxBbmltYXRpb25UaW1lOiBudW1iZXI7XG5cblx0QElucHV0KClcblx0cHVibGljIHJlc2l6ZUJ5cGFzc1JlZnJlc2hUaHJlc2hvbGQ6IG51bWJlcjtcblxuXHRwcm90ZWN0ZWQgX3Njcm9sbFRocm90dGxpbmdUaW1lOiBudW1iZXI7XG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBnZXQgc2Nyb2xsVGhyb3R0bGluZ1RpbWUoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fc2Nyb2xsVGhyb3R0bGluZ1RpbWU7XG5cdH1cblx0cHVibGljIHNldCBzY3JvbGxUaHJvdHRsaW5nVGltZSh2YWx1ZTogbnVtYmVyKSB7XG5cdFx0dGhpcy5fc2Nyb2xsVGhyb3R0bGluZ1RpbWUgPSB2YWx1ZTtcblx0XHR0aGlzLnVwZGF0ZU9uU2Nyb2xsRnVuY3Rpb24oKTtcblx0fVxuXG5cdHByb3RlY3RlZCBfc2Nyb2xsRGVib3VuY2VUaW1lOiBudW1iZXI7XG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBnZXQgc2Nyb2xsRGVib3VuY2VUaW1lKCk6IG51bWJlciB7XG5cdFx0cmV0dXJuIHRoaXMuX3Njcm9sbERlYm91bmNlVGltZTtcblx0fVxuXHRwdWJsaWMgc2V0IHNjcm9sbERlYm91bmNlVGltZSh2YWx1ZTogbnVtYmVyKSB7XG5cdFx0dGhpcy5fc2Nyb2xsRGVib3VuY2VUaW1lID0gdmFsdWU7XG5cdFx0dGhpcy51cGRhdGVPblNjcm9sbEZ1bmN0aW9uKCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgb25TY3JvbGw6ICgpID0+IHZvaWQ7XG5cdHByb3RlY3RlZCB1cGRhdGVPblNjcm9sbEZ1bmN0aW9uKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLnNjcm9sbERlYm91bmNlVGltZSkge1xuXHRcdFx0dGhpcy5vblNjcm9sbCA9IDxhbnk+dGhpcy5kZWJvdW5jZSgoKSA9PiB7XG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XG5cdFx0XHR9LCB0aGlzLnNjcm9sbERlYm91bmNlVGltZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHRoaXMuc2Nyb2xsVGhyb3R0bGluZ1RpbWUpIHtcblx0XHRcdHRoaXMub25TY3JvbGwgPSA8YW55PnRoaXMudGhyb3R0bGVUcmFpbGluZygoKSA9PiB7XG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XG5cdFx0XHR9LCB0aGlzLnNjcm9sbFRocm90dGxpbmdUaW1lKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLm9uU2Nyb2xsID0gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyOiBudW1iZXI7XG5cdHByb3RlY3RlZCBfY2hlY2tSZXNpemVJbnRlcnZhbDogbnVtYmVyO1xuXHRASW5wdXQoKVxuXHRwdWJsaWMgZ2V0IGNoZWNrUmVzaXplSW50ZXJ2YWwoKTogbnVtYmVyIHtcblx0XHRyZXR1cm4gdGhpcy5fY2hlY2tSZXNpemVJbnRlcnZhbDtcblx0fVxuXHRwdWJsaWMgc2V0IGNoZWNrUmVzaXplSW50ZXJ2YWwodmFsdWU6IG51bWJlcikge1xuXHRcdGlmICh0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsID09PSB2YWx1ZSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuX2NoZWNrUmVzaXplSW50ZXJ2YWwgPSB2YWx1ZTtcblx0XHR0aGlzLmFkZFNjcm9sbEV2ZW50SGFuZGxlcnMoKTtcblx0fVxuXG5cdHByb3RlY3RlZCBfaXRlbXM6IGFueVtdID0gW107XG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBnZXQgaXRlbXMoKTogYW55W10ge1xuXHRcdHJldHVybiB0aGlzLl9pdGVtcztcblx0fVxuXHRwdWJsaWMgc2V0IGl0ZW1zKHZhbHVlOiBhbnlbXSkge1xuXHRcdGlmICh2YWx1ZSA9PT0gdGhpcy5faXRlbXMpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aGlzLl9pdGVtcyA9IHZhbHVlIHx8IFtdO1xuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbCh0cnVlKTtcblx0fVxuXG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBjb21wYXJlSXRlbXM6IChpdGVtMTogYW55LCBpdGVtMjogYW55KSA9PiBib29sZWFuID0gKGl0ZW0xOiBhbnksIGl0ZW0yOiBhbnkpID0+IGl0ZW0xID09PSBpdGVtMjtcblxuXHRwcm90ZWN0ZWQgX2hvcml6b250YWw6IGJvb2xlYW47XG5cdEBJbnB1dCgpXG5cdHB1YmxpYyBnZXQgaG9yaXpvbnRhbCgpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5faG9yaXpvbnRhbDtcblx0fVxuXHRwdWJsaWMgc2V0IGhvcml6b250YWwodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9ob3Jpem9udGFsID0gdmFsdWU7XG5cdFx0dGhpcy51cGRhdGVEaXJlY3Rpb24oKTtcblx0fVxuXG5cdHByb3RlY3RlZCByZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk6IHZvaWQge1xuXHRcdGNvbnN0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcblx0XHRpZiAoc2Nyb2xsRWxlbWVudCAmJiB0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93KSB7XG5cdFx0XHRzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy15J10gPSB0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93Lnk7XG5cdFx0XHRzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy14J10gPSB0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93Lng7XG5cdFx0fVxuXG5cdFx0dGhpcy5vbGRQYXJlbnRTY3JvbGxPdmVyZmxvdyA9IHVuZGVmaW5lZDtcblx0fVxuXG5cdHByb3RlY3RlZCBvbGRQYXJlbnRTY3JvbGxPdmVyZmxvdzogeyB4OiBzdHJpbmcsIHk6IHN0cmluZyB9O1xuXHRwcm90ZWN0ZWQgX3BhcmVudFNjcm9sbDogRWxlbWVudCB8IFdpbmRvdztcblx0QElucHV0KClcblx0cHVibGljIGdldCBwYXJlbnRTY3JvbGwoKTogRWxlbWVudCB8IFdpbmRvdyB7XG5cdFx0cmV0dXJuIHRoaXMuX3BhcmVudFNjcm9sbDtcblx0fVxuXHRwdWJsaWMgc2V0IHBhcmVudFNjcm9sbCh2YWx1ZTogRWxlbWVudCB8IFdpbmRvdykge1xuXHRcdGlmICh0aGlzLl9wYXJlbnRTY3JvbGwgPT09IHZhbHVlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy5yZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk7XG5cdFx0dGhpcy5fcGFyZW50U2Nyb2xsID0gdmFsdWU7XG5cdFx0dGhpcy5hZGRTY3JvbGxFdmVudEhhbmRsZXJzKCk7XG5cblx0XHRjb25zdCBzY3JvbGxFbGVtZW50ID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XG5cdFx0aWYgKHRoaXMubW9kaWZ5T3ZlcmZsb3dTdHlsZU9mUGFyZW50U2Nyb2xsICYmIHNjcm9sbEVsZW1lbnQgIT09IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KSB7XG5cdFx0XHR0aGlzLm9sZFBhcmVudFNjcm9sbE92ZXJmbG93ID0geyB4OiBzY3JvbGxFbGVtZW50LnN0eWxlWydvdmVyZmxvdy14J10sIHk6IHNjcm9sbEVsZW1lbnQuc3R5bGVbJ292ZXJmbG93LXknXSB9O1xuXHRcdFx0c2Nyb2xsRWxlbWVudC5zdHlsZVsnb3ZlcmZsb3cteSddID0gdGhpcy5ob3Jpem9udGFsID8gJ3Zpc2libGUnIDogJ2F1dG8nO1xuXHRcdFx0c2Nyb2xsRWxlbWVudC5zdHlsZVsnb3ZlcmZsb3cteCddID0gdGhpcy5ob3Jpem9udGFsID8gJ2F1dG8nIDogJ3Zpc2libGUnO1xuXHRcdH1cblx0fVxuXG5cdEBPdXRwdXQoKVxuXHRwdWJsaWMgdnNVcGRhdGU6IEV2ZW50RW1pdHRlcjxhbnlbXT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueVtdPigpO1xuXG5cdEBPdXRwdXQoKVxuXHRwdWJsaWMgdnNDaGFuZ2U6IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+ID0gbmV3IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+KCk7XG5cblx0QE91dHB1dCgpXG5cdHB1YmxpYyB2c1N0YXJ0OiBFdmVudEVtaXR0ZXI8SVBhZ2VJbmZvPiA9IG5ldyBFdmVudEVtaXR0ZXI8SVBhZ2VJbmZvPigpO1xuXG5cdEBPdXRwdXQoKVxuXHRwdWJsaWMgdnNFbmQ6IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+ID0gbmV3IEV2ZW50RW1pdHRlcjxJUGFnZUluZm8+KCk7XG5cblx0QFZpZXdDaGlsZCgnY29udGVudCcsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuXHRwcm90ZWN0ZWQgY29udGVudEVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cblx0QFZpZXdDaGlsZCgnaW52aXNpYmxlUGFkZGluZycsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuXHRwcm90ZWN0ZWQgaW52aXNpYmxlUGFkZGluZ0VsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG5cblx0QENvbnRlbnRDaGlsZCgnaGVhZGVyJywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IGZhbHNlIH0pXG5cdHByb3RlY3RlZCBoZWFkZXJFbGVtZW50UmVmOiBFbGVtZW50UmVmO1xuXG5cdEBDb250ZW50Q2hpbGQoJ2NvbnRhaW5lcicsIHsgcmVhZDogRWxlbWVudFJlZiwgc3RhdGljOiBmYWxzZSB9KVxuXHRwcm90ZWN0ZWQgY29udGFpbmVyRWxlbWVudFJlZjogRWxlbWVudFJlZjtcblxuXHRwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XG5cdFx0dGhpcy5hZGRTY3JvbGxFdmVudEhhbmRsZXJzKCk7XG5cdH1cblxuXHRwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG5cdFx0dGhpcy5yZW1vdmVTY3JvbGxFdmVudEhhbmRsZXJzKCk7XG5cdFx0dGhpcy5yZXZlcnRQYXJlbnRPdmVyc2Nyb2xsKCk7XG5cdH1cblxuXHRwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogYW55KTogdm9pZCB7XG5cdFx0bGV0IGluZGV4TGVuZ3RoQ2hhbmdlZCA9IHRoaXMuY2FjaGVkSXRlbXNMZW5ndGggIT09IHRoaXMuaXRlbXMubGVuZ3RoO1xuXHRcdHRoaXMuY2FjaGVkSXRlbXNMZW5ndGggPSB0aGlzLml0ZW1zLmxlbmd0aDtcblxuXHRcdGNvbnN0IGZpcnN0UnVuOiBib29sZWFuID0gIWNoYW5nZXMuaXRlbXMgfHwgIWNoYW5nZXMuaXRlbXMucHJldmlvdXNWYWx1ZSB8fCBjaGFuZ2VzLml0ZW1zLnByZXZpb3VzVmFsdWUubGVuZ3RoID09PSAwO1xuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChpbmRleExlbmd0aENoYW5nZWQgfHwgZmlyc3RSdW4pO1xuXHR9XG5cblx0XG5cdHB1YmxpYyBuZ0RvQ2hlY2soKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuY2FjaGVkSXRlbXNMZW5ndGggIT09IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmNhY2hlZEl0ZW1zTGVuZ3RoID0gdGhpcy5pdGVtcy5sZW5ndGg7XG5cdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwodHJ1ZSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGlmICh0aGlzLnByZXZpb3VzVmlld1BvcnQgJiYgdGhpcy52aWV3UG9ydEl0ZW1zICYmIHRoaXMudmlld1BvcnRJdGVtcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgaXRlbXNBcnJheUNoYW5nZWQgPSBmYWxzZTtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52aWV3UG9ydEl0ZW1zLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdGlmICghdGhpcy5jb21wYXJlSXRlbXModGhpcy5pdGVtc1t0aGlzLnByZXZpb3VzVmlld1BvcnQuc3RhcnRJbmRleFdpdGhCdWZmZXIgKyBpXSwgdGhpcy52aWV3UG9ydEl0ZW1zW2ldKSkge1xuXHRcdFx0XHRcdGl0ZW1zQXJyYXlDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKGl0ZW1zQXJyYXlDaGFuZ2VkKSB7XG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbCh0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgcmVmcmVzaCgpOiB2b2lkIHtcblx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwodHJ1ZSk7XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZUFsbENhY2hlZE1lYXN1cmVtZW50cygpOiB2b2lkIHtcblx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMgPSB7XG5cdFx0XHRtYXhDaGlsZFNpemVQZXJXcmFwR3JvdXA6IFtdLFxuXHRcdFx0bnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM6IDAsXG5cdFx0XHRzdW1PZktub3duV3JhcEdyb3VwQ2hpbGRXaWR0aHM6IDAsXG5cdFx0XHRzdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzOiAwXG5cdFx0fTtcblxuXHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCA9IHVuZGVmaW5lZDtcblxuXHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XG5cdH1cblxuXHRwdWJsaWMgaW52YWxpZGF0ZUNhY2hlZE1lYXN1cmVtZW50Rm9ySXRlbShpdGVtOiBhbnkpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5pdGVtcyAmJiB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdFx0XHRpZiAoaW5kZXggPj0gMCkge1xuXHRcdFx0XHR0aGlzLmludmFsaWRhdGVDYWNoZWRNZWFzdXJlbWVudEF0SW5kZXgoaW5kZXgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCA9IHVuZGVmaW5lZDtcblx0XHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UpO1xuXHR9XG5cblx0cHVibGljIGludmFsaWRhdGVDYWNoZWRNZWFzdXJlbWVudEF0SW5kZXgoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuXHRcdGlmICh0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzKSB7XG5cdFx0XHRsZXQgY2FjaGVkTWVhc3VyZW1lbnQgPSB0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW2luZGV4XTtcblx0XHRcdGlmIChjYWNoZWRNZWFzdXJlbWVudCkge1xuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW2luZGV4XSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0LS10aGlzLndyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM7XG5cdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRXaWR0aHMgLT0gY2FjaGVkTWVhc3VyZW1lbnQuY2hpbGRXaWR0aCB8fCAwO1xuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkSGVpZ2h0cyAtPSBjYWNoZWRNZWFzdXJlbWVudC5jaGlsZEhlaWdodCB8fCAwO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCA9IHVuZGVmaW5lZDtcblx0XHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UpO1xuXHR9XG5cblx0cHVibGljIHNjcm9sbEludG8oaXRlbTogYW55LCBhbGlnblRvQmVnaW5uaW5nOiBib29sZWFuID0gdHJ1ZSwgYWRkaXRpb25hbE9mZnNldDogbnVtYmVyID0gMCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzOiBudW1iZXIgPSB1bmRlZmluZWQsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gdW5kZWZpbmVkKTogdm9pZCB7XG5cdFx0bGV0IGluZGV4OiBudW1iZXIgPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XG5cdFx0aWYgKGluZGV4ID09PSAtMSkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuc2Nyb2xsVG9JbmRleChpbmRleCwgYWxpZ25Ub0JlZ2lubmluZywgYWRkaXRpb25hbE9mZnNldCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzLCBhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjayk7XG5cdH1cblxuXHRwdWJsaWMgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBhbGlnblRvQmVnaW5uaW5nOiBib29sZWFuID0gdHJ1ZSwgYWRkaXRpb25hbE9mZnNldDogbnVtYmVyID0gMCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzOiBudW1iZXIgPSB1bmRlZmluZWQsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gdW5kZWZpbmVkKTogdm9pZCB7XG5cdFx0bGV0IG1heFJldHJpZXM6IG51bWJlciA9IDU7XG5cblx0XHRsZXQgcmV0cnlJZk5lZWRlZCA9ICgpID0+IHtcblx0XHRcdC0tbWF4UmV0cmllcztcblx0XHRcdGlmIChtYXhSZXRyaWVzIDw9IDApIHtcblx0XHRcdFx0aWYgKGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0YW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGxldCBkaW1lbnNpb25zID0gdGhpcy5jYWxjdWxhdGVEaW1lbnNpb25zKCk7XG5cdFx0XHRsZXQgZGVzaXJlZFN0YXJ0SW5kZXggPSBNYXRoLm1pbihNYXRoLm1heChpbmRleCwgMCksIGRpbWVuc2lvbnMuaXRlbUNvdW50IC0gMSk7XG5cdFx0XHRpZiAodGhpcy5wcmV2aW91c1ZpZXdQb3J0LnN0YXJ0SW5kZXggPT09IGRlc2lyZWRTdGFydEluZGV4KSB7XG5cdFx0XHRcdGlmIChhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjaykge1xuXHRcdFx0XHRcdGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNjcm9sbFRvSW5kZXhfaW50ZXJuYWwoaW5kZXgsIGFsaWduVG9CZWdpbm5pbmcsIGFkZGl0aW9uYWxPZmZzZXQsIDAsIHJldHJ5SWZOZWVkZWQpO1xuXHRcdH07XG5cblx0XHR0aGlzLnNjcm9sbFRvSW5kZXhfaW50ZXJuYWwoaW5kZXgsIGFsaWduVG9CZWdpbm5pbmcsIGFkZGl0aW9uYWxPZmZzZXQsIGFuaW1hdGlvbk1pbGxpc2Vjb25kcywgcmV0cnlJZk5lZWRlZCk7XG5cdH1cblxuXHRwcm90ZWN0ZWQgc2Nyb2xsVG9JbmRleF9pbnRlcm5hbChpbmRleDogbnVtYmVyLCBhbGlnblRvQmVnaW5uaW5nOiBib29sZWFuID0gdHJ1ZSwgYWRkaXRpb25hbE9mZnNldDogbnVtYmVyID0gMCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzOiBudW1iZXIgPSB1bmRlZmluZWQsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrOiAoKSA9PiB2b2lkID0gdW5kZWZpbmVkKTogdm9pZCB7XG5cdFx0YW5pbWF0aW9uTWlsbGlzZWNvbmRzID0gYW5pbWF0aW9uTWlsbGlzZWNvbmRzID09PSB1bmRlZmluZWQgPyB0aGlzLnNjcm9sbEFuaW1hdGlvblRpbWUgOiBhbmltYXRpb25NaWxsaXNlY29uZHM7XG5cblx0XHRsZXQgZGltZW5zaW9ucyA9IHRoaXMuY2FsY3VsYXRlRGltZW5zaW9ucygpO1xuXHRcdGxldCBzY3JvbGwgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmcoaW5kZXgsIGRpbWVuc2lvbnMpICsgYWRkaXRpb25hbE9mZnNldDtcblx0XHRpZiAoIWFsaWduVG9CZWdpbm5pbmcpIHtcblx0XHRcdHNjcm9sbCAtPSBkaW1lbnNpb25zLndyYXBHcm91cHNQZXJQYWdlICogZGltZW5zaW9uc1t0aGlzLl9jaGlsZFNjcm9sbERpbV07XG5cdFx0fVxuXG5cdFx0dGhpcy5zY3JvbGxUb1Bvc2l0aW9uKHNjcm9sbCwgYW5pbWF0aW9uTWlsbGlzZWNvbmRzLCBhbmltYXRpb25Db21wbGV0ZWRDYWxsYmFjayk7XG5cdH1cblxuXHRwdWJsaWMgc2Nyb2xsVG9Qb3NpdGlvbihzY3JvbGxQb3NpdGlvbjogbnVtYmVyLCBhbmltYXRpb25NaWxsaXNlY29uZHM6IG51bWJlciA9IHVuZGVmaW5lZCwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2s6ICgpID0+IHZvaWQgPSB1bmRlZmluZWQpOiB2b2lkIHtcblx0XHRzY3JvbGxQb3NpdGlvbiArPSB0aGlzLmdldEVsZW1lbnRzT2Zmc2V0KCk7XG5cblx0XHRhbmltYXRpb25NaWxsaXNlY29uZHMgPSBhbmltYXRpb25NaWxsaXNlY29uZHMgPT09IHVuZGVmaW5lZCA/IHRoaXMuc2Nyb2xsQW5pbWF0aW9uVGltZSA6IGFuaW1hdGlvbk1pbGxpc2Vjb25kcztcblxuXHRcdGxldCBzY3JvbGxFbGVtZW50ID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XG5cblx0XHRsZXQgYW5pbWF0aW9uUmVxdWVzdDogbnVtYmVyO1xuXG5cdFx0aWYgKHRoaXMuY3VycmVudFR3ZWVuKSB7XG5cdFx0XHR0aGlzLmN1cnJlbnRUd2Vlbi5zdG9wKCk7XG5cdFx0XHR0aGlzLmN1cnJlbnRUd2VlbiA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRpZiAoIWFuaW1hdGlvbk1pbGxpc2Vjb25kcykge1xuXHRcdFx0dGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShzY3JvbGxFbGVtZW50LCB0aGlzLl9zY3JvbGxUeXBlLCBzY3JvbGxQb3NpdGlvbik7XG5cdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UsIGFuaW1hdGlvbkNvbXBsZXRlZENhbGxiYWNrKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCB0d2VlbkNvbmZpZ09iaiA9IHsgc2Nyb2xsUG9zaXRpb246IHNjcm9sbEVsZW1lbnRbdGhpcy5fc2Nyb2xsVHlwZV0gfTtcblxuXHRcdGxldCBuZXdUd2VlbiA9IG5ldyB0d2Vlbi5Ud2Vlbih0d2VlbkNvbmZpZ09iailcblx0XHRcdC50byh7IHNjcm9sbFBvc2l0aW9uIH0sIGFuaW1hdGlvbk1pbGxpc2Vjb25kcylcblx0XHRcdC5lYXNpbmcodHdlZW4uRWFzaW5nLlF1YWRyYXRpYy5PdXQpXG5cdFx0XHQub25VcGRhdGUoKGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGlzTmFOKGRhdGEuc2Nyb2xsUG9zaXRpb24pKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMucmVuZGVyZXIuc2V0UHJvcGVydHkoc2Nyb2xsRWxlbWVudCwgdGhpcy5fc2Nyb2xsVHlwZSwgZGF0YS5zY3JvbGxQb3NpdGlvbik7XG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSk7XG5cdFx0XHR9KVxuXHRcdFx0Lm9uU3RvcCgoKSA9PiB7XG5cdFx0XHRcdGNhbmNlbEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvblJlcXVlc3QpO1xuXHRcdFx0fSlcblx0XHRcdC5zdGFydCgpO1xuXG5cdFx0Y29uc3QgYW5pbWF0ZSA9ICh0aW1lPzogbnVtYmVyKSA9PiB7XG5cdFx0XHRpZiAoIW5ld1R3ZWVuW1wiaXNQbGF5aW5nXCJdKCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRuZXdUd2Vlbi51cGRhdGUodGltZSk7XG5cdFx0XHRpZiAodHdlZW5Db25maWdPYmouc2Nyb2xsUG9zaXRpb24gPT09IHNjcm9sbFBvc2l0aW9uKSB7XG5cdFx0XHRcdHRoaXMucmVmcmVzaF9pbnRlcm5hbChmYWxzZSwgYW5pbWF0aW9uQ29tcGxldGVkQ2FsbGJhY2spO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRcdGFuaW1hdGlvblJlcXVlc3QgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0YW5pbWF0ZSgpO1xuXHRcdHRoaXMuY3VycmVudFR3ZWVuID0gbmV3VHdlZW47XG5cdH1cblxuXHRwcm90ZWN0ZWQgaXNBbmd1bGFyVW5pdmVyc2FsU1NSOiBib29sZWFuO1xuXG5cdGNvbnN0cnVjdG9yKHByb3RlY3RlZCByZWFkb25seSBlbGVtZW50OiBFbGVtZW50UmVmLFxuXHRcdHByb3RlY3RlZCByZWFkb25seSByZW5kZXJlcjogUmVuZGVyZXIyLFxuXHRcdHByb3RlY3RlZCByZWFkb25seSB6b25lOiBOZ1pvbmUsXG5cdFx0cHJvdGVjdGVkIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcblx0XHRASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3QsXG5cdFx0QE9wdGlvbmFsKCkgQEluamVjdCgndmlydHVhbC1zY3JvbGxlci1kZWZhdWx0LW9wdGlvbnMnKVxuXHRcdG9wdGlvbnM6IFZpcnR1YWxTY3JvbGxlckRlZmF1bHRPcHRpb25zKSB7XG5cdFx0XHRcblx0XHR0aGlzLmlzQW5ndWxhclVuaXZlcnNhbFNTUiA9IGlzUGxhdGZvcm1TZXJ2ZXIocGxhdGZvcm1JZCk7XG5cblx0XHR0aGlzLnNjcm9sbFRocm90dGxpbmdUaW1lID0gb3B0aW9ucy5zY3JvbGxUaHJvdHRsaW5nVGltZTtcblx0XHR0aGlzLnNjcm9sbERlYm91bmNlVGltZSA9IG9wdGlvbnMuc2Nyb2xsRGVib3VuY2VUaW1lO1xuXHRcdHRoaXMuc2Nyb2xsQW5pbWF0aW9uVGltZSA9IG9wdGlvbnMuc2Nyb2xsQW5pbWF0aW9uVGltZTtcblx0XHR0aGlzLnNjcm9sbGJhcldpZHRoID0gb3B0aW9ucy5zY3JvbGxiYXJXaWR0aDtcblx0XHR0aGlzLnNjcm9sbGJhckhlaWdodCA9IG9wdGlvbnMuc2Nyb2xsYmFySGVpZ2h0O1xuXHRcdHRoaXMuY2hlY2tSZXNpemVJbnRlcnZhbCA9IG9wdGlvbnMuY2hlY2tSZXNpemVJbnRlcnZhbDtcblx0XHR0aGlzLnJlc2l6ZUJ5cGFzc1JlZnJlc2hUaHJlc2hvbGQgPSBvcHRpb25zLnJlc2l6ZUJ5cGFzc1JlZnJlc2hUaHJlc2hvbGQ7XG5cdFx0dGhpcy5tb2RpZnlPdmVyZmxvd1N0eWxlT2ZQYXJlbnRTY3JvbGwgPSBvcHRpb25zLm1vZGlmeU92ZXJmbG93U3R5bGVPZlBhcmVudFNjcm9sbDtcblx0XHR0aGlzLnN0cmlwZWRUYWJsZSA9IG9wdGlvbnMuc3RyaXBlZFRhYmxlO1xuXG5cdFx0dGhpcy5ob3Jpem9udGFsID0gZmFsc2U7XG5cdFx0dGhpcy5yZXNldFdyYXBHcm91cERpbWVuc2lvbnMoKTtcblx0fVxuXHRcblx0cHJvdGVjdGVkIGdldEVsZW1lbnRTaXplKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA6IENsaWVudFJlY3Qge1xuXHRcdGxldCByZXN1bHQgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXHRcdGxldCBtYXJnaW5Ub3AgPSBwYXJzZUludChzdHlsZXNbJ21hcmdpbi10b3AnXSwgMTApIHx8IDA7XG5cdFx0bGV0IG1hcmdpbkJvdHRvbSA9IHBhcnNlSW50KHN0eWxlc1snbWFyZ2luLWJvdHRvbSddLCAxMCkgfHwgMDtcblx0XHRsZXQgbWFyZ2luTGVmdCA9IHBhcnNlSW50KHN0eWxlc1snbWFyZ2luLWxlZnQnXSwgMTApIHx8IDA7XG5cdFx0bGV0IG1hcmdpblJpZ2h0ID0gcGFyc2VJbnQoc3R5bGVzWydtYXJnaW4tcmlnaHQnXSwgMTApIHx8IDA7XG5cdFx0XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRvcDogcmVzdWx0LnRvcCArIG1hcmdpblRvcCxcblx0XHRcdGJvdHRvbTogcmVzdWx0LmJvdHRvbSArIG1hcmdpbkJvdHRvbSxcblx0XHRcdGxlZnQ6IHJlc3VsdC5sZWZ0ICsgbWFyZ2luTGVmdCxcblx0XHRcdHJpZ2h0OiByZXN1bHQucmlnaHQgKyBtYXJnaW5SaWdodCxcblx0XHRcdHdpZHRoOiByZXN1bHQud2lkdGggKyBtYXJnaW5MZWZ0ICsgbWFyZ2luUmlnaHQsXG5cdFx0XHRoZWlnaHQ6IHJlc3VsdC5oZWlnaHQgKyBtYXJnaW5Ub3AgKyBtYXJnaW5Cb3R0b21cblx0XHR9O1xuXHR9XG5cblx0cHJvdGVjdGVkIHByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0OiBDbGllbnRSZWN0O1xuXHRwcm90ZWN0ZWQgY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZCgpOiB2b2lkIHtcblx0XHRsZXQgYm91bmRpbmdSZWN0ID0gdGhpcy5nZXRFbGVtZW50U2l6ZSh0aGlzLmdldFNjcm9sbEVsZW1lbnQoKSk7XG5cblx0XHRsZXQgc2l6ZUNoYW5nZWQ6IGJvb2xlYW47XG5cdFx0aWYgKCF0aGlzLnByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0KSB7XG5cdFx0XHRzaXplQ2hhbmdlZCA9IHRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCB3aWR0aENoYW5nZSA9IE1hdGguYWJzKGJvdW5kaW5nUmVjdC53aWR0aCAtIHRoaXMucHJldmlvdXNTY3JvbGxCb3VuZGluZ1JlY3Qud2lkdGgpO1xuXHRcdFx0bGV0IGhlaWdodENoYW5nZSA9IE1hdGguYWJzKGJvdW5kaW5nUmVjdC5oZWlnaHQgLSB0aGlzLnByZXZpb3VzU2Nyb2xsQm91bmRpbmdSZWN0LmhlaWdodCk7XG5cdFx0XHRzaXplQ2hhbmdlZCA9IHdpZHRoQ2hhbmdlID4gdGhpcy5yZXNpemVCeXBhc3NSZWZyZXNoVGhyZXNob2xkIHx8IGhlaWdodENoYW5nZSA+IHRoaXMucmVzaXplQnlwYXNzUmVmcmVzaFRocmVzaG9sZDtcblx0XHR9XG5cblx0XHRpZiAoc2l6ZUNoYW5nZWQpIHtcblx0XHRcdHRoaXMucHJldmlvdXNTY3JvbGxCb3VuZGluZ1JlY3QgPSBib3VuZGluZ1JlY3Q7XG5cdFx0XHRpZiAoYm91bmRpbmdSZWN0LndpZHRoID4gMCAmJiBib3VuZGluZ1JlY3QuaGVpZ2h0ID4gMCkge1xuXHRcdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByb3RlY3RlZCBfaW52aXNpYmxlUGFkZGluZ1Byb3BlcnR5O1xuXHRwcm90ZWN0ZWQgX29mZnNldFR5cGU7XG5cdHByb3RlY3RlZCBfc2Nyb2xsVHlwZTtcblx0cHJvdGVjdGVkIF9wYWdlT2Zmc2V0VHlwZTtcblx0cHJvdGVjdGVkIF9jaGlsZFNjcm9sbERpbTtcblx0cHJvdGVjdGVkIF90cmFuc2xhdGVEaXI7XG5cdHByb3RlY3RlZCBfbWFyZ2luRGlyO1xuXHRwcm90ZWN0ZWQgdXBkYXRlRGlyZWN0aW9uKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmhvcml6b250YWwpIHtcblx0XHRcdHRoaXMuX2ludmlzaWJsZVBhZGRpbmdQcm9wZXJ0eSA9ICd3aWR0aCc7XG5cdFx0XHR0aGlzLl9vZmZzZXRUeXBlID0gJ29mZnNldExlZnQnO1xuXHRcdFx0dGhpcy5fcGFnZU9mZnNldFR5cGUgPSAncGFnZVhPZmZzZXQnO1xuXHRcdFx0dGhpcy5fY2hpbGRTY3JvbGxEaW0gPSAnY2hpbGRXaWR0aCc7XG5cdFx0XHR0aGlzLl9tYXJnaW5EaXIgPSAnbWFyZ2luLWxlZnQnO1xuXHRcdFx0dGhpcy5fdHJhbnNsYXRlRGlyID0gJ3RyYW5zbGF0ZVgnO1xuXHRcdFx0dGhpcy5fc2Nyb2xsVHlwZSA9ICdzY3JvbGxMZWZ0Jztcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLl9pbnZpc2libGVQYWRkaW5nUHJvcGVydHkgPSAnaGVpZ2h0Jztcblx0XHRcdHRoaXMuX29mZnNldFR5cGUgPSAnb2Zmc2V0VG9wJztcblx0XHRcdHRoaXMuX3BhZ2VPZmZzZXRUeXBlID0gJ3BhZ2VZT2Zmc2V0Jztcblx0XHRcdHRoaXMuX2NoaWxkU2Nyb2xsRGltID0gJ2NoaWxkSGVpZ2h0Jztcblx0XHRcdHRoaXMuX21hcmdpbkRpciA9ICdtYXJnaW4tdG9wJztcblx0XHRcdHRoaXMuX3RyYW5zbGF0ZURpciA9ICd0cmFuc2xhdGVZJztcblx0XHRcdHRoaXMuX3Njcm9sbFR5cGUgPSAnc2Nyb2xsVG9wJztcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgZGVib3VuY2UoZnVuYzogRnVuY3Rpb24sIHdhaXQ6IG51bWJlcik6IEZ1bmN0aW9uIHtcblx0XHRjb25zdCB0aHJvdHRsZWQgPSB0aGlzLnRocm90dGxlVHJhaWxpbmcoZnVuYywgd2FpdCk7XG5cdFx0Y29uc3QgcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3R0bGVkWydjYW5jZWwnXSgpO1xuXHRcdFx0dGhyb3R0bGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0fTtcblx0XHRyZXN1bHRbJ2NhbmNlbCddID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3R0bGVkWydjYW5jZWwnXSgpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cHJvdGVjdGVkIHRocm90dGxlVHJhaWxpbmcoZnVuYzogRnVuY3Rpb24sIHdhaXQ6IG51bWJlcik6IEZ1bmN0aW9uIHtcblx0XHRsZXQgdGltZW91dCA9IHVuZGVmaW5lZDtcblx0XHRsZXQgX2FyZ3VtZW50cyA9IGFyZ3VtZW50cztcblx0XHRjb25zdCByZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XG5cdFx0XHRfYXJndW1lbnRzID0gYXJndW1lbnRzXG5cblx0XHRcdGlmICh0aW1lb3V0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHdhaXQgPD0gMCkge1xuXHRcdFx0XHRmdW5jLmFwcGx5KF90aGlzLCBfYXJndW1lbnRzKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR0aW1lb3V0ID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdGZ1bmMuYXBwbHkoX3RoaXMsIF9hcmd1bWVudHMpO1xuXHRcdFx0XHR9LCB3YWl0KTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdHJlc3VsdFsnY2FuY2VsJ10gPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodGltZW91dCkge1xuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdHRpbWVvdXQgPSB1bmRlZmluZWQ7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoOiBudW1iZXIgPSAwO1xuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodDogbnVtYmVyID0gMDtcblxuXHRwcm90ZWN0ZWQgcGFkZGluZzogbnVtYmVyID0gMDtcblx0cHJvdGVjdGVkIHByZXZpb3VzVmlld1BvcnQ6IElWaWV3cG9ydCA9IDxhbnk+e307XG5cdHByb3RlY3RlZCBjdXJyZW50VHdlZW46IHR3ZWVuLlR3ZWVuO1xuXHRwcm90ZWN0ZWQgY2FjaGVkSXRlbXNMZW5ndGg6IG51bWJlcjtcblxuXHRwcm90ZWN0ZWQgZGlzcG9zZVNjcm9sbEhhbmRsZXI6ICgpID0+IHZvaWQgfCB1bmRlZmluZWQ7XG5cdHByb3RlY3RlZCBkaXNwb3NlUmVzaXplSGFuZGxlcjogKCkgPT4gdm9pZCB8IHVuZGVmaW5lZDtcblxuXHRwcm90ZWN0ZWQgcmVmcmVzaF9pbnRlcm5hbChpdGVtc0FycmF5TW9kaWZpZWQ6IGJvb2xlYW4sIHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjazogKCkgPT4gdm9pZCA9IHVuZGVmaW5lZCwgbWF4UnVuVGltZXM6IG51bWJlciA9IDIpOiB2b2lkIHtcblx0XHQvL25vdGU6IG1heFJ1blRpbWVzIGlzIHRvIGZvcmNlIGl0IHRvIGtlZXAgcmVjYWxjdWxhdGluZyBpZiB0aGUgcHJldmlvdXMgaXRlcmF0aW9uIGNhdXNlZCBhIHJlLXJlbmRlciAoZGlmZmVyZW50IHNsaWNlZCBpdGVtcyBpbiB2aWV3cG9ydCBvciBzY3JvbGxQb3NpdGlvbiBjaGFuZ2VkKS5cblx0XHQvL1RoZSBkZWZhdWx0IG9mIDJ4IG1heCB3aWxsIHByb2JhYmx5IGJlIGFjY3VyYXRlIGVub3VnaCB3aXRob3V0IGNhdXNpbmcgdG9vIGxhcmdlIGEgcGVyZm9ybWFuY2UgYm90dGxlbmVja1xuXHRcdC8vVGhlIGNvZGUgd291bGQgdHlwaWNhbGx5IHF1aXQgb3V0IG9uIHRoZSAybmQgaXRlcmF0aW9uIGFueXdheXMuIFRoZSBtYWluIHRpbWUgaXQnZCB0aGluayBtb3JlIHRoYW4gMiBydW5zIHdvdWxkIGJlIG5lY2Vzc2FyeSB3b3VsZCBiZSBmb3IgdmFzdGx5IGRpZmZlcmVudCBzaXplZCBjaGlsZCBpdGVtcyBvciBpZiB0aGlzIGlzIHRoZSAxc3QgdGltZSB0aGUgaXRlbXMgYXJyYXkgd2FzIGluaXRpYWxpemVkLlxuXHRcdC8vV2l0aG91dCBtYXhSdW5UaW1lcywgSWYgdGhlIHVzZXIgaXMgYWN0aXZlbHkgc2Nyb2xsaW5nIHRoaXMgY29kZSB3b3VsZCBiZWNvbWUgYW4gaW5maW5pdGUgbG9vcCB1bnRpbCB0aGV5IHN0b3BwZWQgc2Nyb2xsaW5nLiBUaGlzIHdvdWxkIGJlIG9rYXksIGV4Y2VwdCBlYWNoIHNjcm9sbCBldmVudCB3b3VsZCBzdGFydCBhbiBhZGRpdGlvbmFsIGluZmludGUgbG9vcC4gV2Ugd2FudCB0byBzaG9ydC1jaXJjdWl0IGl0IHRvIHByZXZlbnQgdGhpcy5cblxuXHRcdGlmIChpdGVtc0FycmF5TW9kaWZpZWQgJiYgdGhpcy5wcmV2aW91c1ZpZXdQb3J0ICYmIHRoaXMucHJldmlvdXNWaWV3UG9ydC5zY3JvbGxTdGFydFBvc2l0aW9uID4gMCkge1xuXHRcdC8vaWYgaXRlbXMgd2VyZSBwcmVwZW5kZWQsIHNjcm9sbCBmb3J3YXJkIHRvIGtlZXAgc2FtZSBpdGVtcyB2aXNpYmxlXG5cdFx0XHRsZXQgb2xkVmlld1BvcnQgPSB0aGlzLnByZXZpb3VzVmlld1BvcnQ7XG5cdFx0XHRsZXQgb2xkVmlld1BvcnRJdGVtcyA9IHRoaXMudmlld1BvcnRJdGVtcztcblx0XHRcdFxuXHRcdFx0bGV0IG9sZFJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjayA9IHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaztcblx0XHRcdHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjayA9ICgpID0+IHtcblx0XHRcdFx0bGV0IHNjcm9sbExlbmd0aERlbHRhID0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0LnNjcm9sbExlbmd0aCAtIG9sZFZpZXdQb3J0LnNjcm9sbExlbmd0aDtcblx0XHRcdFx0aWYgKHNjcm9sbExlbmd0aERlbHRhID4gMCAmJiB0aGlzLnZpZXdQb3J0SXRlbXMpIHtcblx0XHRcdFx0XHRsZXQgb2xkU3RhcnRJdGVtID0gb2xkVmlld1BvcnRJdGVtc1swXTtcblx0XHRcdFx0XHRsZXQgb2xkU3RhcnRJdGVtSW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleCh4ID0+IHRoaXMuY29tcGFyZUl0ZW1zKG9sZFN0YXJ0SXRlbSwgeCkpO1xuXHRcdFx0XHRcdGlmIChvbGRTdGFydEl0ZW1JbmRleCA+IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlcikge1xuXHRcdFx0XHRcdFx0bGV0IGl0ZW1PcmRlckNoYW5nZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy52aWV3UG9ydEl0ZW1zLmxlbmd0aDsgKytpKSB7XG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5jb21wYXJlSXRlbXModGhpcy5pdGVtc1tvbGRTdGFydEl0ZW1JbmRleCArIGldLCBvbGRWaWV3UG9ydEl0ZW1zW2ldKSkge1xuXHRcdFx0XHRcdFx0XHRcdGl0ZW1PcmRlckNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmICghaXRlbU9yZGVyQ2hhbmdlZCkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLnNjcm9sbFRvUG9zaXRpb24odGhpcy5wcmV2aW91c1ZpZXdQb3J0LnNjcm9sbFN0YXJ0UG9zaXRpb24gKyBzY3JvbGxMZW5ndGhEZWx0YSAsIDAsIG9sZFJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjayk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGlmIChvbGRSZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2spIHtcblx0XHRcdFx0XHRvbGRSZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblx0XHR9XHRcdFx0XG5cblx0XHR0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuXHRcdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcblxuXHRcdFx0XHRpZiAoaXRlbXNBcnJheU1vZGlmaWVkKSB7XG5cdFx0XHRcdFx0dGhpcy5yZXNldFdyYXBHcm91cERpbWVuc2lvbnMoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRsZXQgdmlld3BvcnQgPSB0aGlzLmNhbGN1bGF0ZVZpZXdwb3J0KCk7XG5cblx0XHRcdFx0bGV0IHN0YXJ0Q2hhbmdlZCA9IGl0ZW1zQXJyYXlNb2RpZmllZCB8fCB2aWV3cG9ydC5zdGFydEluZGV4ICE9PSB0aGlzLnByZXZpb3VzVmlld1BvcnQuc3RhcnRJbmRleDtcblx0XHRcdFx0bGV0IGVuZENoYW5nZWQgPSBpdGVtc0FycmF5TW9kaWZpZWQgfHwgdmlld3BvcnQuZW5kSW5kZXggIT09IHRoaXMucHJldmlvdXNWaWV3UG9ydC5lbmRJbmRleDtcblx0XHRcdFx0bGV0IHNjcm9sbExlbmd0aENoYW5nZWQgPSB2aWV3cG9ydC5zY3JvbGxMZW5ndGggIT09IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zY3JvbGxMZW5ndGg7XG5cdFx0XHRcdGxldCBwYWRkaW5nQ2hhbmdlZCA9IHZpZXdwb3J0LnBhZGRpbmcgIT09IHRoaXMucHJldmlvdXNWaWV3UG9ydC5wYWRkaW5nO1xuXHRcdFx0XHRsZXQgc2Nyb2xsUG9zaXRpb25DaGFuZ2VkID0gdmlld3BvcnQuc2Nyb2xsU3RhcnRQb3NpdGlvbiAhPT0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0LnNjcm9sbFN0YXJ0UG9zaXRpb24gfHwgdmlld3BvcnQuc2Nyb2xsRW5kUG9zaXRpb24gIT09IHRoaXMucHJldmlvdXNWaWV3UG9ydC5zY3JvbGxFbmRQb3NpdGlvbiB8fCB2aWV3cG9ydC5tYXhTY3JvbGxQb3NpdGlvbiAhPT0gdGhpcy5wcmV2aW91c1ZpZXdQb3J0Lm1heFNjcm9sbFBvc2l0aW9uO1xuXG5cdFx0XHRcdHRoaXMucHJldmlvdXNWaWV3UG9ydCA9IHZpZXdwb3J0O1xuXG5cdFx0XHRcdGlmIChzY3JvbGxMZW5ndGhDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmludmlzaWJsZVBhZGRpbmdFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2ludmlzaWJsZVBhZGRpbmdQcm9wZXJ0eSwgYCR7dmlld3BvcnQuc2Nyb2xsTGVuZ3RofXB4YCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocGFkZGluZ0NoYW5nZWQpIHtcblx0XHRcdFx0XHRpZiAodGhpcy51c2VNYXJnaW5JbnN0ZWFkT2ZUcmFuc2xhdGUpIHtcblx0XHRcdFx0XHRcdHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5jb250ZW50RWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9tYXJnaW5EaXIsIGAke3ZpZXdwb3J0LnBhZGRpbmd9cHhgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuY29udGVudEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3RyYW5zZm9ybScsIGAke3RoaXMuX3RyYW5zbGF0ZURpcn0oJHt2aWV3cG9ydC5wYWRkaW5nfXB4KWApO1xuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmNvbnRlbnRFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd3ZWJraXRUcmFuc2Zvcm0nLCBgJHt0aGlzLl90cmFuc2xhdGVEaXJ9KCR7dmlld3BvcnQucGFkZGluZ31weClgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodGhpcy5oZWFkZXJFbGVtZW50UmVmKSB7XG5cdFx0XHRcdFx0bGV0IHNjcm9sbFBvc2l0aW9uID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KClbdGhpcy5fc2Nyb2xsVHlwZV07XG5cdFx0XHRcdFx0bGV0IGNvbnRhaW5lck9mZnNldCA9IHRoaXMuZ2V0RWxlbWVudHNPZmZzZXQoKTtcblx0XHRcdFx0XHRsZXQgb2Zmc2V0ID0gTWF0aC5tYXgoc2Nyb2xsUG9zaXRpb24gLSB2aWV3cG9ydC5wYWRkaW5nIC0gY29udGFpbmVyT2Zmc2V0ICsgdGhpcy5oZWFkZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0LCAwKTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaGVhZGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgYCR7dGhpcy5fdHJhbnNsYXRlRGlyfSgke29mZnNldH1weClgKTtcblx0XHRcdFx0XHR0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuaGVhZGVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnd2Via2l0VHJhbnNmb3JtJywgYCR7dGhpcy5fdHJhbnNsYXRlRGlyfSgke29mZnNldH1weClgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGNvbnN0IGNoYW5nZUV2ZW50QXJnOiBJUGFnZUluZm8gPSAoc3RhcnRDaGFuZ2VkIHx8IGVuZENoYW5nZWQpID8ge1xuXHRcdFx0XHRcdHN0YXJ0SW5kZXg6IHZpZXdwb3J0LnN0YXJ0SW5kZXgsXG5cdFx0XHRcdFx0ZW5kSW5kZXg6IHZpZXdwb3J0LmVuZEluZGV4LFxuXHRcdFx0XHRcdHNjcm9sbFN0YXJ0UG9zaXRpb246IHZpZXdwb3J0LnNjcm9sbFN0YXJ0UG9zaXRpb24sXG5cdFx0XHRcdFx0c2Nyb2xsRW5kUG9zaXRpb246IHZpZXdwb3J0LnNjcm9sbEVuZFBvc2l0aW9uLFxuXHRcdFx0XHRcdHN0YXJ0SW5kZXhXaXRoQnVmZmVyOiB2aWV3cG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlcixcblx0XHRcdFx0XHRlbmRJbmRleFdpdGhCdWZmZXI6IHZpZXdwb3J0LmVuZEluZGV4V2l0aEJ1ZmZlcixcblx0XHRcdFx0XHRtYXhTY3JvbGxQb3NpdGlvbjogdmlld3BvcnQubWF4U2Nyb2xsUG9zaXRpb25cblx0XHRcdFx0fSA6IHVuZGVmaW5lZDtcblxuXG5cdFx0XHRcdGlmIChzdGFydENoYW5nZWQgfHwgZW5kQ2hhbmdlZCB8fCBzY3JvbGxQb3NpdGlvbkNoYW5nZWQpIHtcblx0XHRcdFx0XHRjb25zdCBoYW5kbGVDaGFuZ2VkID0gKCkgPT4ge1xuXHRcdFx0XHRcdFx0Ly8gdXBkYXRlIHRoZSBzY3JvbGwgbGlzdCB0byB0cmlnZ2VyIHJlLXJlbmRlciBvZiBjb21wb25lbnRzIGluIHZpZXdwb3J0XG5cdFx0XHRcdFx0XHR0aGlzLnZpZXdQb3J0SXRlbXMgPSB2aWV3cG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlciA+PSAwICYmIHZpZXdwb3J0LmVuZEluZGV4V2l0aEJ1ZmZlciA+PSAwID8gdGhpcy5pdGVtcy5zbGljZSh2aWV3cG9ydC5zdGFydEluZGV4V2l0aEJ1ZmZlciwgdmlld3BvcnQuZW5kSW5kZXhXaXRoQnVmZmVyICsgMSkgOiBbXTtcblx0XHRcdFx0XHRcdHRoaXMudnNVcGRhdGUuZW1pdCh0aGlzLnZpZXdQb3J0SXRlbXMpO1xuXG5cdFx0XHRcdFx0XHRpZiAoc3RhcnRDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMudnNTdGFydC5lbWl0KGNoYW5nZUV2ZW50QXJnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKGVuZENoYW5nZWQpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy52c0VuZC5lbWl0KGNoYW5nZUV2ZW50QXJnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHN0YXJ0Q2hhbmdlZCB8fCBlbmRDaGFuZ2VkKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cdFx0XHRcdFx0XHRcdHRoaXMudnNDaGFuZ2UuZW1pdChjaGFuZ2VFdmVudEFyZyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChtYXhSdW5UaW1lcyA+IDApIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5yZWZyZXNoX2ludGVybmFsKGZhbHNlLCByZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2ssIG1heFJ1blRpbWVzIC0gMSk7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaykge1xuXHRcdFx0XHRcdFx0XHRyZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9O1xuXG5cblx0XHRcdFx0XHRpZiAodGhpcy5leGVjdXRlUmVmcmVzaE91dHNpZGVBbmd1bGFyWm9uZSkge1xuXHRcdFx0XHRcdFx0aGFuZGxlQ2hhbmdlZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuem9uZS5ydW4oaGFuZGxlQ2hhbmdlZCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChtYXhSdW5UaW1lcyA+IDAgJiYgKHNjcm9sbExlbmd0aENoYW5nZWQgfHwgcGFkZGluZ0NoYW5nZWQpKSB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlZnJlc2hfaW50ZXJuYWwoZmFsc2UsIHJlZnJlc2hDb21wbGV0ZWRDYWxsYmFjaywgbWF4UnVuVGltZXMgLSAxKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAocmVmcmVzaENvbXBsZXRlZENhbGxiYWNrKSB7XG5cdFx0XHRcdFx0XHRyZWZyZXNoQ29tcGxldGVkQ2FsbGJhY2soKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFNjcm9sbEVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuXHRcdHJldHVybiB0aGlzLnBhcmVudFNjcm9sbCBpbnN0YW5jZW9mIFdpbmRvdyA/IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkgOiB0aGlzLnBhcmVudFNjcm9sbCB8fCB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcblx0fVxuXG5cdHByb3RlY3RlZCBhZGRTY3JvbGxFdmVudEhhbmRsZXJzKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLmlzQW5ndWxhclVuaXZlcnNhbFNTUikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGxldCBzY3JvbGxFbGVtZW50ID0gdGhpcy5nZXRTY3JvbGxFbGVtZW50KCk7XG5cblx0XHR0aGlzLnJlbW92ZVNjcm9sbEV2ZW50SGFuZGxlcnMoKTtcblxuXHRcdHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5wYXJlbnRTY3JvbGwgaW5zdGFuY2VvZiBXaW5kb3cpIHtcblx0XHRcdFx0dGhpcy5kaXNwb3NlU2Nyb2xsSGFuZGxlciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCd3aW5kb3cnLCAnc2Nyb2xsJywgdGhpcy5vblNjcm9sbCk7XG5cdFx0XHRcdHRoaXMuZGlzcG9zZVJlc2l6ZUhhbmRsZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbignd2luZG93JywgJ3Jlc2l6ZScsIHRoaXMub25TY3JvbGwpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRoaXMuZGlzcG9zZVNjcm9sbEhhbmRsZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihzY3JvbGxFbGVtZW50LCAnc2Nyb2xsJywgdGhpcy5vblNjcm9sbCk7XG5cdFx0XHRcdGlmICh0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsID4gMCkge1xuXHRcdFx0XHRcdHRoaXMuY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyID0gPGFueT5zZXRJbnRlcnZhbCgoKSA9PiB7IHRoaXMuY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZCgpOyB9LCB0aGlzLl9jaGVja1Jlc2l6ZUludGVydmFsKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0cHJvdGVjdGVkIHJlbW92ZVNjcm9sbEV2ZW50SGFuZGxlcnMoKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMuY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyKSB7XG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuY2hlY2tTY3JvbGxFbGVtZW50UmVzaXplZFRpbWVyKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5kaXNwb3NlU2Nyb2xsSGFuZGxlcikge1xuXHRcdFx0dGhpcy5kaXNwb3NlU2Nyb2xsSGFuZGxlcigpO1xuXHRcdFx0dGhpcy5kaXNwb3NlU2Nyb2xsSGFuZGxlciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5kaXNwb3NlUmVzaXplSGFuZGxlcikge1xuXHRcdFx0dGhpcy5kaXNwb3NlUmVzaXplSGFuZGxlcigpO1xuXHRcdFx0dGhpcy5kaXNwb3NlUmVzaXplSGFuZGxlciA9IHVuZGVmaW5lZDtcblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgZ2V0RWxlbWVudHNPZmZzZXQoKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5pc0FuZ3VsYXJVbml2ZXJzYWxTU1IpIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblxuXHRcdGxldCBvZmZzZXQgPSAwO1xuXG5cdFx0aWYgKHRoaXMuY29udGFpbmVyRWxlbWVudFJlZiAmJiB0aGlzLmNvbnRhaW5lckVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkge1xuXHRcdFx0b2Zmc2V0ICs9IHRoaXMuY29udGFpbmVyRWxlbWVudFJlZi5uYXRpdmVFbGVtZW50W3RoaXMuX29mZnNldFR5cGVdO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLnBhcmVudFNjcm9sbCkge1xuXHRcdFx0bGV0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcblx0XHRcdGxldCBlbGVtZW50Q2xpZW50UmVjdCA9IHRoaXMuZ2V0RWxlbWVudFNpemUodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuXHRcdFx0bGV0IHNjcm9sbENsaWVudFJlY3QgPSB0aGlzLmdldEVsZW1lbnRTaXplKHNjcm9sbEVsZW1lbnQpO1xuXHRcdFx0aWYgKHRoaXMuaG9yaXpvbnRhbCkge1xuXHRcdFx0XHRvZmZzZXQgKz0gZWxlbWVudENsaWVudFJlY3QubGVmdCAtIHNjcm9sbENsaWVudFJlY3QubGVmdDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRvZmZzZXQgKz0gZWxlbWVudENsaWVudFJlY3QudG9wIC0gc2Nyb2xsQ2xpZW50UmVjdC50b3A7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghKHRoaXMucGFyZW50U2Nyb2xsIGluc3RhbmNlb2YgV2luZG93KSkge1xuXHRcdFx0XHRvZmZzZXQgKz0gc2Nyb2xsRWxlbWVudFt0aGlzLl9zY3JvbGxUeXBlXTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2Zmc2V0O1xuXHR9XG5cblx0cHJvdGVjdGVkIGNvdW50SXRlbXNQZXJXcmFwR3JvdXAoKTogbnVtYmVyIHtcblx0XHRpZiAodGhpcy5pc0FuZ3VsYXJVbml2ZXJzYWxTU1IpIHtcblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKHRoaXMuaG9yaXpvbnRhbCA/IHRoaXMuc3NyVmlld3BvcnRIZWlnaHQgLyB0aGlzLnNzckNoaWxkSGVpZ2h0IDogdGhpcy5zc3JWaWV3cG9ydFdpZHRoIC8gdGhpcy5zc3JDaGlsZFdpZHRoKTtcblx0XHR9XG5cblx0XHRsZXQgcHJvcGVydHlOYW1lID0gdGhpcy5ob3Jpem9udGFsID8gJ29mZnNldExlZnQnIDogJ29mZnNldFRvcCc7XG5cdFx0bGV0IGNoaWxkcmVuID0gKCh0aGlzLmNvbnRhaW5lckVsZW1lbnRSZWYgJiYgdGhpcy5jb250YWluZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHx8IHRoaXMuY29udGVudEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkuY2hpbGRyZW47XG5cblx0XHRsZXQgY2hpbGRyZW5MZW5ndGggPSBjaGlsZHJlbiA/IGNoaWxkcmVuLmxlbmd0aCA6IDA7XG5cdFx0aWYgKGNoaWxkcmVuTGVuZ3RoID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHRsZXQgZmlyc3RPZmZzZXQgPSBjaGlsZHJlblswXVtwcm9wZXJ0eU5hbWVdO1xuXHRcdGxldCByZXN1bHQgPSAxO1xuXHRcdHdoaWxlIChyZXN1bHQgPCBjaGlsZHJlbkxlbmd0aCAmJiBmaXJzdE9mZnNldCA9PT0gY2hpbGRyZW5bcmVzdWx0XVtwcm9wZXJ0eU5hbWVdKSB7XG5cdFx0XHQrK3Jlc3VsdDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cHJvdGVjdGVkIGdldFNjcm9sbFN0YXJ0UG9zaXRpb24oKTogbnVtYmVyIHtcblx0XHRsZXQgd2luZG93U2Nyb2xsVmFsdWUgPSB1bmRlZmluZWQ7XG5cdFx0aWYgKHRoaXMucGFyZW50U2Nyb2xsIGluc3RhbmNlb2YgV2luZG93KSB7XG5cdFx0XHR3aW5kb3dTY3JvbGxWYWx1ZSA9IHdpbmRvd1t0aGlzLl9wYWdlT2Zmc2V0VHlwZV07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHdpbmRvd1Njcm9sbFZhbHVlIHx8IHRoaXMuZ2V0U2Nyb2xsRWxlbWVudCgpW3RoaXMuX3Njcm9sbFR5cGVdIHx8IDA7XG5cdH1cblxuXHRwcm90ZWN0ZWQgbWluTWVhc3VyZWRDaGlsZFdpZHRoOiBudW1iZXI7XG5cdHByb3RlY3RlZCBtaW5NZWFzdXJlZENoaWxkSGVpZ2h0OiBudW1iZXI7XG5cblx0cHJvdGVjdGVkIHdyYXBHcm91cERpbWVuc2lvbnM6IFdyYXBHcm91cERpbWVuc2lvbnM7XG5cblx0cHJvdGVjdGVkIHJlc2V0V3JhcEdyb3VwRGltZW5zaW9ucygpOiB2b2lkIHtcblx0XHRjb25zdCBvbGRXcmFwR3JvdXBEaW1lbnNpb25zID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zO1xuXHRcdHRoaXMuaW52YWxpZGF0ZUFsbENhY2hlZE1lYXN1cmVtZW50cygpO1xuXG5cdFx0aWYgKCF0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzIHx8ICFvbGRXcmFwR3JvdXBEaW1lbnNpb25zIHx8IG9sZFdyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXMgPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRjb25zdCBpdGVtc1BlcldyYXBHcm91cDogbnVtYmVyID0gdGhpcy5jb3VudEl0ZW1zUGVyV3JhcEdyb3VwKCk7XG5cdFx0Zm9yIChsZXQgd3JhcEdyb3VwSW5kZXggPSAwOyB3cmFwR3JvdXBJbmRleCA8IG9sZFdyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwLmxlbmd0aDsgKyt3cmFwR3JvdXBJbmRleCkge1xuXHRcdFx0Y29uc3Qgb2xkV3JhcEdyb3VwRGltZW5zaW9uOiBXcmFwR3JvdXBEaW1lbnNpb24gPSBvbGRXcmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFt3cmFwR3JvdXBJbmRleF07XG5cdFx0XHRpZiAoIW9sZFdyYXBHcm91cERpbWVuc2lvbiB8fCAhb2xkV3JhcEdyb3VwRGltZW5zaW9uLml0ZW1zIHx8ICFvbGRXcmFwR3JvdXBEaW1lbnNpb24uaXRlbXMubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob2xkV3JhcEdyb3VwRGltZW5zaW9uLml0ZW1zLmxlbmd0aCAhPT0gaXRlbXNQZXJXcmFwR3JvdXApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgaXRlbXNDaGFuZ2VkID0gZmFsc2U7XG5cdFx0XHRsZXQgYXJyYXlTdGFydEluZGV4ID0gaXRlbXNQZXJXcmFwR3JvdXAgKiB3cmFwR3JvdXBJbmRleDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXNQZXJXcmFwR3JvdXA7ICsraSkge1xuXHRcdFx0XHRpZiAoIXRoaXMuY29tcGFyZUl0ZW1zKG9sZFdyYXBHcm91cERpbWVuc2lvbi5pdGVtc1tpXSwgdGhpcy5pdGVtc1thcnJheVN0YXJ0SW5kZXggKyBpXSkpIHtcblx0XHRcdFx0XHRpdGVtc0NoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmICghaXRlbXNDaGFuZ2VkKSB7XG5cdFx0XHRcdCsrdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm51bWJlck9mS25vd25XcmFwR3JvdXBDaGlsZFNpemVzO1xuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzICs9IG9sZFdyYXBHcm91cERpbWVuc2lvbi5jaGlsZFdpZHRoIHx8IDA7XG5cdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzICs9IG9sZFdyYXBHcm91cERpbWVuc2lvbi5jaGlsZEhlaWdodCB8fCAwO1xuXHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW3dyYXBHcm91cEluZGV4XSA9IG9sZFdyYXBHcm91cERpbWVuc2lvbjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlRGltZW5zaW9ucygpOiBJRGltZW5zaW9ucyB7XG5cdFx0bGV0IHNjcm9sbEVsZW1lbnQgPSB0aGlzLmdldFNjcm9sbEVsZW1lbnQoKTtcblxuXHRcdGNvbnN0IG1heENhbGN1bGF0ZWRTY3JvbGxCYXJTaXplOiBudW1iZXIgPSAyNTsgLy8gTm90ZTogRm9ybXVsYSB0byBhdXRvLWNhbGN1bGF0ZSBkb2Vzbid0IHdvcmsgZm9yIFBhcmVudFNjcm9sbCwgc28gd2UgZGVmYXVsdCB0byB0aGlzIGlmIG5vdCBzZXQgYnkgY29uc3VtaW5nIGFwcGxpY2F0aW9uXG5cdFx0dGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFySGVpZ2h0ID0gTWF0aC5tYXgoTWF0aC5taW4oc2Nyb2xsRWxlbWVudC5vZmZzZXRIZWlnaHQgLSBzY3JvbGxFbGVtZW50LmNsaWVudEhlaWdodCwgbWF4Q2FsY3VsYXRlZFNjcm9sbEJhclNpemUpLCB0aGlzLmNhbGN1bGF0ZWRTY3JvbGxiYXJIZWlnaHQpO1xuXHRcdHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoID0gTWF0aC5tYXgoTWF0aC5taW4oc2Nyb2xsRWxlbWVudC5vZmZzZXRXaWR0aCAtIHNjcm9sbEVsZW1lbnQuY2xpZW50V2lkdGgsIG1heENhbGN1bGF0ZWRTY3JvbGxCYXJTaXplKSwgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGgpO1xuXG5cdFx0bGV0IHZpZXdwb3J0V2lkdGggPSBzY3JvbGxFbGVtZW50Lm9mZnNldFdpZHRoIC0gKHRoaXMuc2Nyb2xsYmFyV2lkdGggfHwgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggfHwgKHRoaXMuaG9yaXpvbnRhbCA/IDAgOiBtYXhDYWxjdWxhdGVkU2Nyb2xsQmFyU2l6ZSkpO1xuXHRcdGxldCB2aWV3cG9ydEhlaWdodCA9IHNjcm9sbEVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gKHRoaXMuc2Nyb2xsYmFySGVpZ2h0IHx8IHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodCB8fCAodGhpcy5ob3Jpem9udGFsID8gbWF4Q2FsY3VsYXRlZFNjcm9sbEJhclNpemUgOiAwKSk7XG5cblx0XHRsZXQgY29udGVudCA9ICh0aGlzLmNvbnRhaW5lckVsZW1lbnRSZWYgJiYgdGhpcy5jb250YWluZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHx8IHRoaXMuY29udGVudEVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuXHRcdGxldCBpdGVtc1BlcldyYXBHcm91cCA9IHRoaXMuY291bnRJdGVtc1BlcldyYXBHcm91cCgpO1xuXHRcdGxldCB3cmFwR3JvdXBzUGVyUGFnZTtcblxuXHRcdGxldCBkZWZhdWx0Q2hpbGRXaWR0aDtcblx0XHRsZXQgZGVmYXVsdENoaWxkSGVpZ2h0O1xuXG5cdFx0aWYgKHRoaXMuaXNBbmd1bGFyVW5pdmVyc2FsU1NSKSB7XG5cdFx0XHR2aWV3cG9ydFdpZHRoID0gdGhpcy5zc3JWaWV3cG9ydFdpZHRoO1xuXHRcdFx0dmlld3BvcnRIZWlnaHQgPSB0aGlzLnNzclZpZXdwb3J0SGVpZ2h0O1xuXHRcdFx0ZGVmYXVsdENoaWxkV2lkdGggPSB0aGlzLnNzckNoaWxkV2lkdGg7XG5cdFx0XHRkZWZhdWx0Q2hpbGRIZWlnaHQgPSB0aGlzLnNzckNoaWxkSGVpZ2h0O1xuXHRcdFx0bGV0IGl0ZW1zUGVyUm93ID0gTWF0aC5tYXgoTWF0aC5jZWlsKHZpZXdwb3J0V2lkdGggLyBkZWZhdWx0Q2hpbGRXaWR0aCksIDEpO1xuXHRcdFx0bGV0IGl0ZW1zUGVyQ29sID0gTWF0aC5tYXgoTWF0aC5jZWlsKHZpZXdwb3J0SGVpZ2h0IC8gZGVmYXVsdENoaWxkSGVpZ2h0KSwgMSk7XG5cdFx0XHR3cmFwR3JvdXBzUGVyUGFnZSA9IHRoaXMuaG9yaXpvbnRhbCA/IGl0ZW1zUGVyUm93IDogaXRlbXNQZXJDb2w7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCF0aGlzLmVuYWJsZVVuZXF1YWxDaGlsZHJlblNpemVzKSB7XG5cdFx0XHRpZiAoY29udGVudC5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGlmICghdGhpcy5jaGlsZFdpZHRoIHx8ICF0aGlzLmNoaWxkSGVpZ2h0KSB7XG5cdFx0XHRcdFx0aWYgKCF0aGlzLm1pbk1lYXN1cmVkQ2hpbGRXaWR0aCAmJiB2aWV3cG9ydFdpZHRoID4gMCkge1xuXHRcdFx0XHRcdFx0dGhpcy5taW5NZWFzdXJlZENoaWxkV2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoIXRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCAmJiB2aWV3cG9ydEhlaWdodCA+IDApIHtcblx0XHRcdFx0XHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxldCBjaGlsZCA9IGNvbnRlbnQuY2hpbGRyZW5bMF07XG5cdFx0XHRcdGxldCBjbGllbnRSZWN0ID0gdGhpcy5nZXRFbGVtZW50U2l6ZShjaGlsZCk7XG5cdFx0XHRcdHRoaXMubWluTWVhc3VyZWRDaGlsZFdpZHRoID0gTWF0aC5taW4odGhpcy5taW5NZWFzdXJlZENoaWxkV2lkdGgsIGNsaWVudFJlY3Qud2lkdGgpO1xuXHRcdFx0XHR0aGlzLm1pbk1lYXN1cmVkQ2hpbGRIZWlnaHQgPSBNYXRoLm1pbih0aGlzLm1pbk1lYXN1cmVkQ2hpbGRIZWlnaHQsIGNsaWVudFJlY3QuaGVpZ2h0KTtcblx0XHRcdH1cblxuXHRcdFx0ZGVmYXVsdENoaWxkV2lkdGggPSB0aGlzLmNoaWxkV2lkdGggfHwgdGhpcy5taW5NZWFzdXJlZENoaWxkV2lkdGggfHwgdmlld3BvcnRXaWR0aDtcblx0XHRcdGRlZmF1bHRDaGlsZEhlaWdodCA9IHRoaXMuY2hpbGRIZWlnaHQgfHwgdGhpcy5taW5NZWFzdXJlZENoaWxkSGVpZ2h0IHx8IHZpZXdwb3J0SGVpZ2h0O1xuXHRcdFx0bGV0IGl0ZW1zUGVyUm93ID0gTWF0aC5tYXgoTWF0aC5jZWlsKHZpZXdwb3J0V2lkdGggLyBkZWZhdWx0Q2hpbGRXaWR0aCksIDEpO1xuXHRcdFx0bGV0IGl0ZW1zUGVyQ29sID0gTWF0aC5tYXgoTWF0aC5jZWlsKHZpZXdwb3J0SGVpZ2h0IC8gZGVmYXVsdENoaWxkSGVpZ2h0KSwgMSk7XG5cdFx0XHR3cmFwR3JvdXBzUGVyUGFnZSA9IHRoaXMuaG9yaXpvbnRhbCA/IGl0ZW1zUGVyUm93IDogaXRlbXNQZXJDb2w7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGxldCBzY3JvbGxPZmZzZXQgPSBzY3JvbGxFbGVtZW50W3RoaXMuX3Njcm9sbFR5cGVdIC0gKHRoaXMucHJldmlvdXNWaWV3UG9ydCA/IHRoaXMucHJldmlvdXNWaWV3UG9ydC5wYWRkaW5nIDogMCk7XG5cblx0XHRcdGxldCBhcnJheVN0YXJ0SW5kZXggPSB0aGlzLnByZXZpb3VzVmlld1BvcnQuc3RhcnRJbmRleFdpdGhCdWZmZXIgfHwgMDtcblx0XHRcdGxldCB3cmFwR3JvdXBJbmRleCA9IE1hdGguY2VpbChhcnJheVN0YXJ0SW5kZXggLyBpdGVtc1BlcldyYXBHcm91cCk7XG5cblx0XHRcdGxldCBtYXhXaWR0aEZvcldyYXBHcm91cCA9IDA7XG5cdFx0XHRsZXQgbWF4SGVpZ2h0Rm9yV3JhcEdyb3VwID0gMDtcblx0XHRcdGxldCBzdW1PZlZpc2libGVNYXhXaWR0aHMgPSAwO1xuXHRcdFx0bGV0IHN1bU9mVmlzaWJsZU1heEhlaWdodHMgPSAwO1xuXHRcdFx0d3JhcEdyb3Vwc1BlclBhZ2UgPSAwO1xuXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcblx0XHRcdFx0KythcnJheVN0YXJ0SW5kZXg7XG5cdFx0XHRcdGxldCBjaGlsZCA9IGNvbnRlbnQuY2hpbGRyZW5baV07XG5cdFx0XHRcdGxldCBjbGllbnRSZWN0ID0gdGhpcy5nZXRFbGVtZW50U2l6ZShjaGlsZCk7XG5cblx0XHRcdFx0bWF4V2lkdGhGb3JXcmFwR3JvdXAgPSBNYXRoLm1heChtYXhXaWR0aEZvcldyYXBHcm91cCwgY2xpZW50UmVjdC53aWR0aCk7XG5cdFx0XHRcdG1heEhlaWdodEZvcldyYXBHcm91cCA9IE1hdGgubWF4KG1heEhlaWdodEZvcldyYXBHcm91cCwgY2xpZW50UmVjdC5oZWlnaHQpO1xuXG5cdFx0XHRcdGlmIChhcnJheVN0YXJ0SW5kZXggJSBpdGVtc1BlcldyYXBHcm91cCA9PT0gMCkge1xuXHRcdFx0XHRcdGxldCBvbGRWYWx1ZSA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbd3JhcEdyb3VwSW5kZXhdO1xuXHRcdFx0XHRcdGlmIChvbGRWYWx1ZSkge1xuXHRcdFx0XHRcdFx0LS10aGlzLndyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM7XG5cdFx0XHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzIC09IG9sZFZhbHVlLmNoaWxkV2lkdGggfHwgMDtcblx0XHRcdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzIC09IG9sZFZhbHVlLmNoaWxkSGVpZ2h0IHx8IDA7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Kyt0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubnVtYmVyT2ZLbm93bldyYXBHcm91cENoaWxkU2l6ZXM7XG5cdFx0XHRcdFx0Y29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKGFycmF5U3RhcnRJbmRleCAtIGl0ZW1zUGVyV3JhcEdyb3VwLCBhcnJheVN0YXJ0SW5kZXgpO1xuXHRcdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbd3JhcEdyb3VwSW5kZXhdID0ge1xuXHRcdFx0XHRcdFx0Y2hpbGRXaWR0aDogbWF4V2lkdGhGb3JXcmFwR3JvdXAsXG5cdFx0XHRcdFx0XHRjaGlsZEhlaWdodDogbWF4SGVpZ2h0Rm9yV3JhcEdyb3VwLFxuXHRcdFx0XHRcdFx0aXRlbXM6IGl0ZW1zXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHR0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkV2lkdGhzICs9IG1heFdpZHRoRm9yV3JhcEdyb3VwO1xuXHRcdFx0XHRcdHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5zdW1PZktub3duV3JhcEdyb3VwQ2hpbGRIZWlnaHRzICs9IG1heEhlaWdodEZvcldyYXBHcm91cDtcblxuXHRcdFx0XHRcdGlmICh0aGlzLmhvcml6b250YWwpIHtcblx0XHRcdFx0XHRcdGxldCBtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXAgPSBNYXRoLm1pbihtYXhXaWR0aEZvcldyYXBHcm91cCwgTWF0aC5tYXgodmlld3BvcnRXaWR0aCAtIHN1bU9mVmlzaWJsZU1heFdpZHRocywgMCkpO1xuXHRcdFx0XHRcdFx0aWYgKHNjcm9sbE9mZnNldCA+IDApIHtcblx0XHRcdFx0XHRcdFx0bGV0IHNjcm9sbE9mZnNldFRvUmVtb3ZlID0gTWF0aC5taW4oc2Nyb2xsT2Zmc2V0LCBtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXApO1xuXHRcdFx0XHRcdFx0XHRtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXAgLT0gc2Nyb2xsT2Zmc2V0VG9SZW1vdmU7XG5cdFx0XHRcdFx0XHRcdHNjcm9sbE9mZnNldCAtPSBzY3JvbGxPZmZzZXRUb1JlbW92ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c3VtT2ZWaXNpYmxlTWF4V2lkdGhzICs9IG1heFZpc2libGVXaWR0aEZvcldyYXBHcm91cDtcblx0XHRcdFx0XHRcdGlmIChtYXhWaXNpYmxlV2lkdGhGb3JXcmFwR3JvdXAgPiAwICYmIHZpZXdwb3J0V2lkdGggPj0gc3VtT2ZWaXNpYmxlTWF4V2lkdGhzKSB7XG5cdFx0XHRcdFx0XHRcdCsrd3JhcEdyb3Vwc1BlclBhZ2U7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGxldCBtYXhWaXNpYmxlSGVpZ2h0Rm9yV3JhcEdyb3VwID0gTWF0aC5taW4obWF4SGVpZ2h0Rm9yV3JhcEdyb3VwLCBNYXRoLm1heCh2aWV3cG9ydEhlaWdodCAtIHN1bU9mVmlzaWJsZU1heEhlaWdodHMsIDApKTtcblx0XHRcdFx0XHRcdGlmIChzY3JvbGxPZmZzZXQgPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGxldCBzY3JvbGxPZmZzZXRUb1JlbW92ZSA9IE1hdGgubWluKHNjcm9sbE9mZnNldCwgbWF4VmlzaWJsZUhlaWdodEZvcldyYXBHcm91cCk7XG5cdFx0XHRcdFx0XHRcdG1heFZpc2libGVIZWlnaHRGb3JXcmFwR3JvdXAgLT0gc2Nyb2xsT2Zmc2V0VG9SZW1vdmU7XG5cdFx0XHRcdFx0XHRcdHNjcm9sbE9mZnNldCAtPSBzY3JvbGxPZmZzZXRUb1JlbW92ZTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0c3VtT2ZWaXNpYmxlTWF4SGVpZ2h0cyArPSBtYXhWaXNpYmxlSGVpZ2h0Rm9yV3JhcEdyb3VwO1xuXHRcdFx0XHRcdFx0aWYgKG1heFZpc2libGVIZWlnaHRGb3JXcmFwR3JvdXAgPiAwICYmIHZpZXdwb3J0SGVpZ2h0ID49IHN1bU9mVmlzaWJsZU1heEhlaWdodHMpIHtcblx0XHRcdFx0XHRcdFx0Kyt3cmFwR3JvdXBzUGVyUGFnZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQrK3dyYXBHcm91cEluZGV4O1xuXG5cdFx0XHRcdFx0bWF4V2lkdGhGb3JXcmFwR3JvdXAgPSAwO1xuXHRcdFx0XHRcdG1heEhlaWdodEZvcldyYXBHcm91cCA9IDA7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGV0IGF2ZXJhZ2VDaGlsZFdpZHRoID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLnN1bU9mS25vd25XcmFwR3JvdXBDaGlsZFdpZHRocyAvIHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5udW1iZXJPZktub3duV3JhcEdyb3VwQ2hpbGRTaXplcztcblx0XHRcdGxldCBhdmVyYWdlQ2hpbGRIZWlnaHQgPSB0aGlzLndyYXBHcm91cERpbWVuc2lvbnMuc3VtT2ZLbm93bldyYXBHcm91cENoaWxkSGVpZ2h0cyAvIHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5udW1iZXJPZktub3duV3JhcEdyb3VwQ2hpbGRTaXplcztcblx0XHRcdGRlZmF1bHRDaGlsZFdpZHRoID0gdGhpcy5jaGlsZFdpZHRoIHx8IGF2ZXJhZ2VDaGlsZFdpZHRoIHx8IHZpZXdwb3J0V2lkdGg7XG5cdFx0XHRkZWZhdWx0Q2hpbGRIZWlnaHQgPSB0aGlzLmNoaWxkSGVpZ2h0IHx8IGF2ZXJhZ2VDaGlsZEhlaWdodCB8fCB2aWV3cG9ydEhlaWdodDtcblxuXHRcdFx0aWYgKHRoaXMuaG9yaXpvbnRhbCkge1xuXHRcdFx0XHRpZiAodmlld3BvcnRXaWR0aCA+IHN1bU9mVmlzaWJsZU1heFdpZHRocykge1xuXHRcdFx0XHRcdHdyYXBHcm91cHNQZXJQYWdlICs9IE1hdGguY2VpbCgodmlld3BvcnRXaWR0aCAtIHN1bU9mVmlzaWJsZU1heFdpZHRocykgLyBkZWZhdWx0Q2hpbGRXaWR0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh2aWV3cG9ydEhlaWdodCA+IHN1bU9mVmlzaWJsZU1heEhlaWdodHMpIHtcblx0XHRcdFx0XHR3cmFwR3JvdXBzUGVyUGFnZSArPSBNYXRoLmNlaWwoKHZpZXdwb3J0SGVpZ2h0IC0gc3VtT2ZWaXNpYmxlTWF4SGVpZ2h0cykgLyBkZWZhdWx0Q2hpbGRIZWlnaHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0bGV0IGl0ZW1Db3VudCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuXHRcdGxldCBpdGVtc1BlclBhZ2UgPSBpdGVtc1BlcldyYXBHcm91cCAqIHdyYXBHcm91cHNQZXJQYWdlO1xuXHRcdGxldCBwYWdlQ291bnRfZnJhY3Rpb25hbCA9IGl0ZW1Db3VudCAvIGl0ZW1zUGVyUGFnZTtcblx0XHRsZXQgbnVtYmVyT2ZXcmFwR3JvdXBzID0gTWF0aC5jZWlsKGl0ZW1Db3VudCAvIGl0ZW1zUGVyV3JhcEdyb3VwKTtcblxuXHRcdGxldCBzY3JvbGxMZW5ndGggPSAwO1xuXG5cdFx0bGV0IGRlZmF1bHRTY3JvbGxMZW5ndGhQZXJXcmFwR3JvdXAgPSB0aGlzLmhvcml6b250YWwgPyBkZWZhdWx0Q2hpbGRXaWR0aCA6IGRlZmF1bHRDaGlsZEhlaWdodDtcblx0XHRpZiAodGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xuXHRcdFx0bGV0IG51bVVua25vd25DaGlsZFNpemVzID0gMDtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZXcmFwR3JvdXBzOyArK2kpIHtcblx0XHRcdFx0bGV0IGNoaWxkU2l6ZSA9IHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaV0gJiYgdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFtpXVt0aGlzLl9jaGlsZFNjcm9sbERpbV07XG5cdFx0XHRcdGlmIChjaGlsZFNpemUpIHtcblx0XHRcdFx0XHRzY3JvbGxMZW5ndGggKz0gY2hpbGRTaXplO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCsrbnVtVW5rbm93bkNoaWxkU2l6ZXM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0c2Nyb2xsTGVuZ3RoICs9IE1hdGgucm91bmQobnVtVW5rbm93bkNoaWxkU2l6ZXMgKiBkZWZhdWx0U2Nyb2xsTGVuZ3RoUGVyV3JhcEdyb3VwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2Nyb2xsTGVuZ3RoID0gbnVtYmVyT2ZXcmFwR3JvdXBzICogZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cDtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5oZWFkZXJFbGVtZW50UmVmKSB7XG5cdFx0XHRzY3JvbGxMZW5ndGggKz0gdGhpcy5oZWFkZXJFbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuXHRcdH1cblxuXHRcdGxldCB2aWV3cG9ydExlbmd0aCA9IHRoaXMuaG9yaXpvbnRhbCA/IHZpZXdwb3J0V2lkdGggOiB2aWV3cG9ydEhlaWdodDtcblx0XHRsZXQgbWF4U2Nyb2xsUG9zaXRpb24gPSBNYXRoLm1heChzY3JvbGxMZW5ndGggLSB2aWV3cG9ydExlbmd0aCwgMCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0aXRlbUNvdW50OiBpdGVtQ291bnQsXG5cdFx0XHRpdGVtc1BlcldyYXBHcm91cDogaXRlbXNQZXJXcmFwR3JvdXAsXG5cdFx0XHR3cmFwR3JvdXBzUGVyUGFnZTogd3JhcEdyb3Vwc1BlclBhZ2UsXG5cdFx0XHRpdGVtc1BlclBhZ2U6IGl0ZW1zUGVyUGFnZSxcblx0XHRcdHBhZ2VDb3VudF9mcmFjdGlvbmFsOiBwYWdlQ291bnRfZnJhY3Rpb25hbCxcblx0XHRcdGNoaWxkV2lkdGg6IGRlZmF1bHRDaGlsZFdpZHRoLFxuXHRcdFx0Y2hpbGRIZWlnaHQ6IGRlZmF1bHRDaGlsZEhlaWdodCxcblx0XHRcdHNjcm9sbExlbmd0aDogc2Nyb2xsTGVuZ3RoLFxuXHRcdFx0dmlld3BvcnRMZW5ndGg6IHZpZXdwb3J0TGVuZ3RoLFxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IG1heFNjcm9sbFBvc2l0aW9uXG5cdFx0fTtcblx0fVxuXG5cdHByb3RlY3RlZCBjYWNoZWRQYWdlU2l6ZTogbnVtYmVyID0gMDtcblx0cHJvdGVjdGVkIHByZXZpb3VzU2Nyb2xsTnVtYmVyRWxlbWVudHM6IG51bWJlciA9IDA7XG5cblx0cHJvdGVjdGVkIGNhbGN1bGF0ZVBhZGRpbmcoYXJyYXlTdGFydEluZGV4V2l0aEJ1ZmZlcjogbnVtYmVyLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucyk6IG51bWJlciB7XG5cdFx0aWYgKGRpbWVuc2lvbnMuaXRlbUNvdW50ID09PSAwKSB7XG5cdFx0XHRyZXR1cm4gMDtcblx0XHR9XG5cblx0XHRsZXQgZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCA9IGRpbWVuc2lvbnNbdGhpcy5fY2hpbGRTY3JvbGxEaW1dO1xuXHRcdGxldCBzdGFydGluZ1dyYXBHcm91cEluZGV4ID0gTWF0aC5mbG9vcihhcnJheVN0YXJ0SW5kZXhXaXRoQnVmZmVyIC8gZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cCkgfHwgMDtcblxuXHRcdGlmICghdGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xuXHRcdFx0cmV0dXJuIGRlZmF1bHRTY3JvbGxMZW5ndGhQZXJXcmFwR3JvdXAgKiBzdGFydGluZ1dyYXBHcm91cEluZGV4O1xuXHRcdH1cblxuXHRcdGxldCBudW1Vbmtub3duQ2hpbGRTaXplcyA9IDA7XG5cdFx0bGV0IHJlc3VsdCA9IDA7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdGFydGluZ1dyYXBHcm91cEluZGV4OyArK2kpIHtcblx0XHRcdGxldCBjaGlsZFNpemUgPSB0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW2ldICYmIHRoaXMud3JhcEdyb3VwRGltZW5zaW9ucy5tYXhDaGlsZFNpemVQZXJXcmFwR3JvdXBbaV1bdGhpcy5fY2hpbGRTY3JvbGxEaW1dO1xuXHRcdFx0aWYgKGNoaWxkU2l6ZSkge1xuXHRcdFx0XHRyZXN1bHQgKz0gY2hpbGRTaXplO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0KytudW1Vbmtub3duQ2hpbGRTaXplcztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmVzdWx0ICs9IE1hdGgucm91bmQobnVtVW5rbm93bkNoaWxkU2l6ZXMgKiBkZWZhdWx0U2Nyb2xsTGVuZ3RoUGVyV3JhcEdyb3VwKTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgY2FsY3VsYXRlUGFnZUluZm8oc2Nyb2xsUG9zaXRpb246IG51bWJlciwgZGltZW5zaW9uczogSURpbWVuc2lvbnMpOiBJUGFnZUluZm8ge1xuXHRcdGxldCBzY3JvbGxQZXJjZW50YWdlID0gMDtcblx0XHRpZiAodGhpcy5lbmFibGVVbmVxdWFsQ2hpbGRyZW5TaXplcykge1xuXHRcdFx0Y29uc3QgbnVtYmVyT2ZXcmFwR3JvdXBzID0gTWF0aC5jZWlsKGRpbWVuc2lvbnMuaXRlbUNvdW50IC8gZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cCk7XG5cdFx0XHRsZXQgdG90YWxTY3JvbGxlZExlbmd0aCA9IDA7XG5cdFx0XHRsZXQgZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cCA9IGRpbWVuc2lvbnNbdGhpcy5fY2hpbGRTY3JvbGxEaW1dO1xuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZldyYXBHcm91cHM7ICsraSkge1xuXHRcdFx0XHRsZXQgY2hpbGRTaXplID0gdGhpcy53cmFwR3JvdXBEaW1lbnNpb25zLm1heENoaWxkU2l6ZVBlcldyYXBHcm91cFtpXSAmJiB0aGlzLndyYXBHcm91cERpbWVuc2lvbnMubWF4Q2hpbGRTaXplUGVyV3JhcEdyb3VwW2ldW3RoaXMuX2NoaWxkU2Nyb2xsRGltXTtcblx0XHRcdFx0aWYgKGNoaWxkU2l6ZSkge1xuXHRcdFx0XHRcdHRvdGFsU2Nyb2xsZWRMZW5ndGggKz0gY2hpbGRTaXplO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRvdGFsU2Nyb2xsZWRMZW5ndGggKz0gZGVmYXVsdFNjcm9sbExlbmd0aFBlcldyYXBHcm91cDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChzY3JvbGxQb3NpdGlvbiA8IHRvdGFsU2Nyb2xsZWRMZW5ndGgpIHtcblx0XHRcdFx0XHRzY3JvbGxQZXJjZW50YWdlID0gaSAvIG51bWJlck9mV3JhcEdyb3Vwcztcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRzY3JvbGxQZXJjZW50YWdlID0gc2Nyb2xsUG9zaXRpb24gLyBkaW1lbnNpb25zLnNjcm9sbExlbmd0aDtcblx0XHR9XG5cblx0XHRsZXQgc3RhcnRpbmdBcnJheUluZGV4X2ZyYWN0aW9uYWwgPSBNYXRoLm1pbihNYXRoLm1heChzY3JvbGxQZXJjZW50YWdlICogZGltZW5zaW9ucy5wYWdlQ291bnRfZnJhY3Rpb25hbCwgMCksIGRpbWVuc2lvbnMucGFnZUNvdW50X2ZyYWN0aW9uYWwpICogZGltZW5zaW9ucy5pdGVtc1BlclBhZ2U7XG5cblx0XHRsZXQgbWF4U3RhcnQgPSBkaW1lbnNpb25zLml0ZW1Db3VudCAtIGRpbWVuc2lvbnMuaXRlbXNQZXJQYWdlIC0gMTtcblx0XHRsZXQgYXJyYXlTdGFydEluZGV4ID0gTWF0aC5taW4oTWF0aC5mbG9vcihzdGFydGluZ0FycmF5SW5kZXhfZnJhY3Rpb25hbCksIG1heFN0YXJ0KTtcblx0XHRhcnJheVN0YXJ0SW5kZXggLT0gYXJyYXlTdGFydEluZGV4ICUgZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cDsgLy8gcm91bmQgZG93biB0byBzdGFydCBvZiB3cmFwR3JvdXBcblxuXHRcdGlmICh0aGlzLnN0cmlwZWRUYWJsZSkge1xuXHRcdFx0bGV0IGJ1ZmZlckJvdW5kYXJ5ID0gMiAqIGRpbWVuc2lvbnMuaXRlbXNQZXJXcmFwR3JvdXA7XG5cdFx0XHRpZiAoYXJyYXlTdGFydEluZGV4ICUgYnVmZmVyQm91bmRhcnkgIT09IDApIHtcblx0XHRcdFx0YXJyYXlTdGFydEluZGV4ID0gTWF0aC5tYXgoYXJyYXlTdGFydEluZGV4IC0gYXJyYXlTdGFydEluZGV4ICUgYnVmZmVyQm91bmRhcnksIDApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBhcnJheUVuZEluZGV4ID0gTWF0aC5jZWlsKHN0YXJ0aW5nQXJyYXlJbmRleF9mcmFjdGlvbmFsKSArIGRpbWVuc2lvbnMuaXRlbXNQZXJQYWdlIC0gMTtcblx0XHRsZXQgZW5kSW5kZXhXaXRoaW5XcmFwR3JvdXAgPSAoYXJyYXlFbmRJbmRleCArIDEpICUgZGltZW5zaW9ucy5pdGVtc1BlcldyYXBHcm91cDtcblx0XHRpZiAoZW5kSW5kZXhXaXRoaW5XcmFwR3JvdXAgPiAwKSB7XG5cdFx0XHRhcnJheUVuZEluZGV4ICs9IGRpbWVuc2lvbnMuaXRlbXNQZXJXcmFwR3JvdXAgLSBlbmRJbmRleFdpdGhpbldyYXBHcm91cDsgLy8gcm91bmQgdXAgdG8gZW5kIG9mIHdyYXBHcm91cFxuXHRcdH1cblxuXHRcdGlmIChpc05hTihhcnJheVN0YXJ0SW5kZXgpKSB7XG5cdFx0XHRhcnJheVN0YXJ0SW5kZXggPSAwO1xuXHRcdH1cblx0XHRpZiAoaXNOYU4oYXJyYXlFbmRJbmRleCkpIHtcblx0XHRcdGFycmF5RW5kSW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdGFycmF5U3RhcnRJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KGFycmF5U3RhcnRJbmRleCwgMCksIGRpbWVuc2lvbnMuaXRlbUNvdW50IC0gMSk7XG5cdFx0YXJyYXlFbmRJbmRleCA9IE1hdGgubWluKE1hdGgubWF4KGFycmF5RW5kSW5kZXgsIDApLCBkaW1lbnNpb25zLml0ZW1Db3VudCAtIDEpO1xuXG5cdFx0bGV0IGJ1ZmZlclNpemUgPSB0aGlzLmJ1ZmZlckFtb3VudCAqIGRpbWVuc2lvbnMuaXRlbXNQZXJXcmFwR3JvdXA7XG5cdFx0bGV0IHN0YXJ0SW5kZXhXaXRoQnVmZmVyID0gTWF0aC5taW4oTWF0aC5tYXgoYXJyYXlTdGFydEluZGV4IC0gYnVmZmVyU2l6ZSwgMCksIGRpbWVuc2lvbnMuaXRlbUNvdW50IC0gMSk7XG5cdFx0bGV0IGVuZEluZGV4V2l0aEJ1ZmZlciA9IE1hdGgubWluKE1hdGgubWF4KGFycmF5RW5kSW5kZXggKyBidWZmZXJTaXplLCAwKSwgZGltZW5zaW9ucy5pdGVtQ291bnQgLSAxKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdGFydEluZGV4OiBhcnJheVN0YXJ0SW5kZXgsXG5cdFx0XHRlbmRJbmRleDogYXJyYXlFbmRJbmRleCxcblx0XHRcdHN0YXJ0SW5kZXhXaXRoQnVmZmVyOiBzdGFydEluZGV4V2l0aEJ1ZmZlcixcblx0XHRcdGVuZEluZGV4V2l0aEJ1ZmZlcjogZW5kSW5kZXhXaXRoQnVmZmVyLFxuXHRcdFx0c2Nyb2xsU3RhcnRQb3NpdGlvbjogc2Nyb2xsUG9zaXRpb24sXG5cdFx0XHRzY3JvbGxFbmRQb3NpdGlvbjogc2Nyb2xsUG9zaXRpb24gKyBkaW1lbnNpb25zLnZpZXdwb3J0TGVuZ3RoLFxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IGRpbWVuc2lvbnMubWF4U2Nyb2xsUG9zaXRpb25cblx0XHR9O1xuXHR9XG5cblx0cHJvdGVjdGVkIGNhbGN1bGF0ZVZpZXdwb3J0KCk6IElWaWV3cG9ydCB7XG5cdFx0bGV0IGRpbWVuc2lvbnMgPSB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbnMoKTtcblx0XHRsZXQgb2Zmc2V0ID0gdGhpcy5nZXRFbGVtZW50c09mZnNldCgpO1xuXG5cdFx0bGV0IHNjcm9sbFN0YXJ0UG9zaXRpb24gPSB0aGlzLmdldFNjcm9sbFN0YXJ0UG9zaXRpb24oKTtcblx0XHRpZiAoc2Nyb2xsU3RhcnRQb3NpdGlvbiA+IChkaW1lbnNpb25zLnNjcm9sbExlbmd0aCArIG9mZnNldCkgJiYgISh0aGlzLnBhcmVudFNjcm9sbCBpbnN0YW5jZW9mIFdpbmRvdykpIHtcblx0XHRcdHNjcm9sbFN0YXJ0UG9zaXRpb24gPSBkaW1lbnNpb25zLnNjcm9sbExlbmd0aDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c2Nyb2xsU3RhcnRQb3NpdGlvbiAtPSBvZmZzZXQ7XG5cdFx0fVxuXHRcdHNjcm9sbFN0YXJ0UG9zaXRpb24gPSBNYXRoLm1heCgwLCBzY3JvbGxTdGFydFBvc2l0aW9uKTtcblxuXHRcdGxldCBwYWdlSW5mbyA9IHRoaXMuY2FsY3VsYXRlUGFnZUluZm8oc2Nyb2xsU3RhcnRQb3NpdGlvbiwgZGltZW5zaW9ucyk7XG5cdFx0bGV0IG5ld1BhZGRpbmcgPSB0aGlzLmNhbGN1bGF0ZVBhZGRpbmcocGFnZUluZm8uc3RhcnRJbmRleFdpdGhCdWZmZXIsIGRpbWVuc2lvbnMpO1xuXHRcdGxldCBuZXdTY3JvbGxMZW5ndGggPSBkaW1lbnNpb25zLnNjcm9sbExlbmd0aDtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRzdGFydEluZGV4OiBwYWdlSW5mby5zdGFydEluZGV4LFxuXHRcdFx0ZW5kSW5kZXg6IHBhZ2VJbmZvLmVuZEluZGV4LFxuXHRcdFx0c3RhcnRJbmRleFdpdGhCdWZmZXI6IHBhZ2VJbmZvLnN0YXJ0SW5kZXhXaXRoQnVmZmVyLFxuXHRcdFx0ZW5kSW5kZXhXaXRoQnVmZmVyOiBwYWdlSW5mby5lbmRJbmRleFdpdGhCdWZmZXIsXG5cdFx0XHRwYWRkaW5nOiBNYXRoLnJvdW5kKG5ld1BhZGRpbmcpLFxuXHRcdFx0c2Nyb2xsTGVuZ3RoOiBNYXRoLnJvdW5kKG5ld1Njcm9sbExlbmd0aCksXG5cdFx0XHRzY3JvbGxTdGFydFBvc2l0aW9uOiBwYWdlSW5mby5zY3JvbGxTdGFydFBvc2l0aW9uLFxuXHRcdFx0c2Nyb2xsRW5kUG9zaXRpb246IHBhZ2VJbmZvLnNjcm9sbEVuZFBvc2l0aW9uLFxuXHRcdFx0bWF4U2Nyb2xsUG9zaXRpb246IHBhZ2VJbmZvLm1heFNjcm9sbFBvc2l0aW9uXG5cdFx0fTtcblx0fVxufVxuXG5ATmdNb2R1bGUoe1xuXHRleHBvcnRzOiBbVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50XSxcblx0ZGVjbGFyYXRpb25zOiBbVmlydHVhbFNjcm9sbGVyQ29tcG9uZW50XSxcblx0aW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG5cdHByb3ZpZGVyczogW1xuXHRcdHtcblx0XHRcdHByb3ZpZGU6ICd2aXJ0dWFsLXNjcm9sbGVyLWRlZmF1bHQtb3B0aW9ucycsXG5cdFx0XHR1c2VGYWN0b3J5OiBWSVJUVUFMX1NDUk9MTEVSX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZXG5cdFx0fVxuXHRdXG59KVxuZXhwb3J0IGNsYXNzIFZpcnR1YWxTY3JvbGxlck1vZHVsZSB7IH0iXX0=
