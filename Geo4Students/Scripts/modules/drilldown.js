﻿(function(g) {
    function y(b, a, c) {
        var e;
        !a.rgba.length || !b.rgba.length ? (Highcharts.error(23), b = a.raw) : (b = b.rgba, a = a.rgba, e = a[3] !== 1 || b[3] !== 1, b = (e ? "rgba(" : "rgb(") + Math.round(a[0] + (b[0] - a[0]) * (1 - c)) + "," + Math.round(a[1] + (b[1] - a[1]) * (1 - c)) + "," + Math.round(a[2] + (b[2] - a[2]) * (1 - c)) + (e ? "," + (a[3] + (b[3] - a[3]) * (1 - c)) : "") + ")");
        return b;
    }

    var r = function() {},
        n = g.getOptions(),
        j = g.each,
        k = g.extend,
        z = g.format,
        s = g.pick,
        o = g.wrap,
        h = g.Chart,
        m = g.seriesTypes,
        t = m.pie,
        l = m.column,
        u = HighchartsAdapter.fireEvent,
        v = HighchartsAdapter.inArray,
        p = [],
        w = 1;
    j(["fill", "stroke"], function(b) { HighchartsAdapter.addAnimSetter(b, function(a) { a.elem.attr(b, y(g.Color(a.start), g.Color(a.end), a.pos)) }) });
    k(n.lang, { drillUpText: "◁ Back to {series.name}" });
    n.drilldown = { activeAxisLabelStyle: { cursor: "pointer", color: "#0d233a", fontWeight: "bold", textDecoration: "underline" }, activeDataLabelStyle: { cursor: "pointer", color: "#0d233a", fontWeight: "bold", textDecoration: "underline" }, animation: { duration: 500 }, drillUpButton: { position: { align: "right", x: -10, y: 10 } } };
    g.SVGRenderer.prototype.Element.prototype.fadeIn =
        function(b) { this.attr({ opacity: 0.1, visibility: "inherit" }).animate({ opacity: s(this.newOpacity, 1) }, b || { duration: 250 }) };
    h.prototype.addSeriesAsDrilldown = function(b, a) {
        this.addSingleSeriesAsDrilldown(b, a);
        this.applyDrilldown();
    };
    h.prototype.addSingleSeriesAsDrilldown = function(b, a) {
        var c = b.series, e = c.xAxis, f = c.yAxis, d;
        d = b.color || c.color;
        var i, g = [], x = [], h;
        h = c.options._levelNumber || 0;
        a = k({ color: d, _ddSeriesId: w++ }, a);
        i = v(b, c.points);
        j(c.chart.series, function(a) {
            if (a.xAxis === e)
                g.push(a), a.options._ddSeriesId =
                    a.options._ddSeriesId || w++, a.options._colorIndex = a.userOptions._colorIndex, x.push(a.options), a.options._levelNumber = a.options._levelNumber || h;
        });
        d = { levelNumber: h, seriesOptions: c.options, levelSeriesOptions: x, levelSeries: g, shapeArgs: b.shapeArgs, bBox: b.graphic ? b.graphic.getBBox() : {}, color: d, lowerSeriesOptions: a, pointOptions: c.options.data[i], pointIndex: i, oldExtremes: { xMin: e && e.userMin, xMax: e && e.userMax, yMin: f && f.userMin, yMax: f && f.userMax } };
        if (!this.drilldownLevels)this.drilldownLevels = [];
        this.drilldownLevels.push(d);
        d = d.lowerSeries = this.addSeries(a, !1);
        d.options._levelNumber = h + 1;
        if (e)e.oldPos = e.pos, e.userMin = e.userMax = null, f.userMin = f.userMax = null;
        if (c.type === d.type)d.animate = d.animateDrilldown || r, d.options.animation = !0;
    };
    h.prototype.applyDrilldown = function() {
        var b = this.drilldownLevels, a;
        if (b && b.length > 0)a = b[b.length - 1].levelNumber, j(this.drilldownLevels, function(b) { b.levelNumber === a && j(b.levelSeries, function(b) { b.options && b.options._levelNumber === a && b.remove(!1) }) });
        this.redraw();
        this.showDrillUpButton();
    };
    h.prototype.getDrilldownBackText =
        function() {
            var b = this.drilldownLevels;
            if (b && b.length > 0)return b = b[b.length - 1], b.series = b.seriesOptions, z(this.options.lang.drillUpText, b);
        };
    h.prototype.showDrillUpButton = function() {
        var b = this, a = this.getDrilldownBackText(), c = b.options.drilldown.drillUpButton, e, f;
        this.drillUpButton ? this.drillUpButton.attr({ text: a }).align() : (f = (e = c.theme) && e.states, this.drillUpButton = this.renderer.button(a, null, null, function() { b.drillUp() }, e, f && f.hover, f && f.select).attr({ align: c.position.align, zIndex: 9 }).add().align(c.position,
            !1, c.relativeTo || "plotBox"));
    };
    h.prototype.drillUp = function() {
        for (var b = this,
            a = b.drilldownLevels,
            c = a[a.length - 1].levelNumber,
            e = a.length,
            f = b.series,
            d,
            i,
            g,
            h,
            k = function(a) {
                var c;
                j(f, function(b) { b.options._ddSeriesId === a._ddSeriesId && (c = b) });
                c = c || b.addSeries(a, !1);
                if (c.type === g.type && c.animateDrillupTo)c.animate = c.animateDrillupTo;
                a === i.seriesOptions && (h = c);
            }; e--;)
            if (i = a[e], i.levelNumber === c) {
                a.pop();
                g = i.lowerSeries;
                if (!g.chart)
                    for (d = f.length; d--;)
                        if (f[d].options.id === i.lowerSeriesOptions.id) {
                            g = f[d];
                            break;
                        }
                g.xData =
                [];
                j(i.levelSeriesOptions, k);
                u(b, "drillup", { seriesOptions: i.seriesOptions });
                if (h.type === g.type)h.drilldownLevel = i, h.options.animation = b.options.drilldown.animation, g.animateDrillupFrom && g.chart && g.animateDrillupFrom(i);
                h.options._levelNumber = c;
                g.remove(!1);
                if (h.xAxis)d = i.oldExtremes, h.xAxis.setExtremes(d.xMin, d.xMax, !1), h.yAxis.setExtremes(d.yMin, d.yMax, !1);
            }
        this.redraw();
        this.drilldownLevels.length === 0 ? this.drillUpButton = this.drillUpButton.destroy() : this.drillUpButton.attr({ text: this.getDrilldownBackText() }).align();
        p.length = [];
    };
    l.prototype.supportsDrilldown = !0;
    l.prototype.animateDrillupTo = function(b) {
        if (!b) {
            var a = this, c = a.drilldownLevel;
            j(this.points, function(a) {
                a.graphic && a.graphic.hide();
                a.dataLabel && a.dataLabel.hide();
                a.connector && a.connector.hide();
            });
            setTimeout(function() {
                a.points && j(a.points, function(a, b) {
                    var d = b === (c && c.pointIndex) ? "show" : "fadeIn", i = d === "show" ? !0 : void 0;
                    if (a.graphic)a.graphic[d](i);
                    if (a.dataLabel)a.dataLabel[d](i);
                    if (a.connector)a.connector[d](i);
                });
            }, Math.max(this.chart.options.drilldown.animation.duration -
                50, 0));
            this.animate = r;
        }
    };
    l.prototype.animateDrilldown = function(b) {
        var a = this, c = this.chart.drilldownLevels, e, f = this.chart.options.drilldown.animation, d = this.xAxis;
        if (!b)
            j(c, function(b) { if (a.options._ddSeriesId === b.lowerSeriesOptions._ddSeriesId)e = b.shapeArgs, e.fill = b.color }), e.x += s(d.oldPos, d.pos) - d.pos, j(this.points, function(a) {
                a.graphic && a.graphic.attr(e).animate(k(a.shapeArgs, { fill: a.color }), f);
                a.dataLabel && a.dataLabel.fadeIn(f);
            }), this.animate = null;
    };
    l.prototype.animateDrillupFrom = function(b) {
        var a =
                this.chart.options.drilldown.animation,
            c = this.group,
            e = this;
        j(e.trackerGroups, function(a) { if (e[a])e[a].on("mouseover") });
        delete this.group;
        j(this.points, function(e) {
            var d = e.graphic,
                i = function() {
                    d.destroy();
                    c && (c = c.destroy());
                };
            d && (delete e.graphic, a ? d.animate(k(b.shapeArgs, { fill: b.color }), g.merge(a, { complete: i })) : (d.attr(b.shapeArgs), i()));
        });
    };
    t && k(t.prototype, {
        supportsDrilldown: !0,
        animateDrillupTo: l.prototype.animateDrillupTo,
        animateDrillupFrom: l.prototype.animateDrillupFrom,
        animateDrilldown: function(b) {
            var a =
                    this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
                c = this.chart.options.drilldown.animation,
                e = a.shapeArgs,
                f = e.start,
                d = (e.end - f) / this.points.length;
            if (!b)j(this.points, function(b, h) { b.graphic.attr(g.merge(e, { start: f + h * d, end: f + (h + 1) * d, fill: a.color }))[c ? "animate" : "attr"](k(b.shapeArgs, { fill: b.color }), c) }), this.animate = null;
        }
    });
    g.Point.prototype.doDrilldown = function(b, a) {
        for (var c = this.series.chart, e = c.options.drilldown, f = (e.series || []).length, d; f-- && !d;)
            e.series[f].id === this.drilldown && v(this.drilldown,
                p) === -1 && (d = e.series[f], p.push(this.drilldown));
        u(c, "drilldown", { point: this, seriesOptions: d, category: a, points: a !== void 0 && this.series.xAxis.ticks[a].label.ddPoints.slice(0) });
        d && (b ? c.addSingleSeriesAsDrilldown(this, d) : c.addSeriesAsDrilldown(this, d));
    };
    g.Axis.prototype.drilldownCategory = function(b) {
        j(this.ticks[b].label.ddPoints, function(a) { a.series && a.series.visible && a.doDrilldown && a.doDrilldown(!0, b) });
        this.chart.applyDrilldown();
    };
    o(g.Point.prototype, "init", function(b, a, c, e) {
        var f = b.call(this, a, c,
                e),
            b = a.chart;
        if (c = (c = a.xAxis && a.xAxis.ticks[e]) && c.label) {
            if (!c.ddPoints)c.ddPoints = [];
            if (c.levelNumber !== a.options._levelNumber)c.ddPoints.length = 0;
        }
        if (f.drilldown) {
            if (g.addEvent(f, "click", function() { f.doDrilldown() }), c) {
                if (!c.basicStyles)c.basicStyles = g.merge(c.styles);
                c.addClass("highcharts-drilldown-axis-label").css(b.options.drilldown.activeAxisLabelStyle).on("click", function() { a.xAxis.drilldownCategory(e) });
                c.ddPoints.push(f);
                c.levelNumber = a.options._levelNumber;
            }
        } else if (c && c.basicStyles && c.levelNumber !==
            a.options._levelNumber)c.styles = {}, c.css(c.basicStyles), c.on("click", null);
        return f;
    });
    o(g.Series.prototype, "drawDataLabels", function(b) {
        var a = this.chart.options.drilldown.activeDataLabelStyle;
        b.call(this);
        j(this.points, function(b) { if (b.drilldown && b.dataLabel)b.dataLabel.attr({ "class": "highcharts-drilldown-data-label" }).css(a).on("click", function() { b.doDrilldown() }) });
    });
    var q,
        n = function(b) {
            b.call(this);
            j(this.points, function(a) { a.drilldown && a.graphic && a.graphic.attr({ "class": "highcharts-drilldown-point" }).css({ cursor: "pointer" }) });
        };
    for (q in m)m[q].prototype.supportsDrilldown && o(m[q].prototype, "drawTracker", n);
})(Highcharts);