
(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.mobile.ui,
        Popup = kendo.ui.Popup,
        SHIM = '<div class="km-shim"/>',
        Widget = ui.Widget,
        MOUSEUP = kendo.support.mouseup + ".kendoMobileShim";

    var Shim = Widget.extend({
        init: function(element, options) {
            var that = this,
                ios = kendo.mobile.application.os === "ios",
                align = options.align || (ios ?  "bottom center" : "center center"),
                position = options.position || (ios ? "bottom center" : "center center"),
                effect = options.effect || (ios ? "slideIn:up" : "fade:in"),
                shim = $(SHIM).hide();

            Widget.fn.init.call(that, element, options);

            that.shim = shim;
            that.element = element;

            if (!that.options.modal) {
                that.shim.on(MOUSEUP, $.proxy(that.hide, that));
            }

            kendo.mobile.application.element.append(shim);

            that.popup = new Popup(that.element, {
                anchor: shim,
                appendTo: shim,
                origin: align,
                position: position,
                animation: {
                    open: {
                        effects: effect,
                        duration: that.options.duration
                    },
                    close: {
                        duration: that.options.duration
                    }
                },
                deactivate: function() {
                    shim.hide();
                },
                open: function() {
                    shim.show();
                }
            });

            kendo.notify(that);
        },

        options: {
            name: "Shim",
            modal: true,
            align: undefined,
            position: undefined,
            effect: undefined,
            duration: 200
        },

        show: function() {
            this.popup.open();
        },

        hide: function() {
            this.popup.close();
        },

        destroy: function() {
            Widget.fn.destroy.call(this);
            this.shim.off(MOUSEUP);
            this.popup.destroy();
        }
    });

    ui.plugin(Shim);
})(jQuery);
