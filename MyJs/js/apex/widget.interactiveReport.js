(null === apex.worksheet || "object" != typeof apex.worksheet) && (apex.worksheet = {}),
apex.worksheet = {
	ws: function(pId) {
		function init(pId) {
			this.l_Action = !1,
				this.l_Type = !1,
				that.ajax_busy = !1,
				pId && (that.worksheet_id = pId),
				that.report_id = $v("apexir_REPORT_ID") ? $v("apexir_REPORT_ID") : "0",
				$x("apexir_REGION_ID") && apex.jQuery("#" + $v("apexir_REGION_ID")).bind("apexrefresh",
					function() {
						that.search()
					}),
				this.get = new htmldb_Get(null, $v("pFlowId"), "APXWGT", $v("pFlowStepId"))
		}
		var that = this;
		this.ajax_busy = !1,
			this.worksheet_id = !1,
			this.report_id = !1,
			this.current_col_id = !1,
			this.last_col_id = !1,
			this.current_control = !1,
			this.active_dialog = !1,
			this.supress_update = !1,
			this.external_items = !1,
			this.init = init,
			this.init(pId),
			this.toggle_controls = function() {
				var lTest = "none" != $x("apexir_CONTROL_PANEL_COMPLETE").style.display ? "Y" : "N";
				$x_ToggleWithImage("apexir_CONTROLS_IMAGE", ["apexir_CONTROL_PANEL_COMPLETE", "apexir_CONTROL_PANEL_SUMMARY"]),
					that.supress_update = !0,
					that.action("CONTROL_MIN", !1, !1, lTest)
			},
			this.item = {},
			this.item.worksheet_holder = function() {
				return $x("apexir_WORKSHEET_REGION")
			},
			this.item.worksheet_detail = function() {
				return $x("apexir_DETAIL")
			},
			this.item.worksheet_report = function() {
				return $x("apexir_REPORT")
			},
			this.item.worksheet_div = function() {
				return $x("apexir_WORKSHEET")
			},
			this.item.control_panel_drop = function() {
				return $x("apexir_CONTROL_PANEL_DROP")
			},
			this.item.ws_control_panel = function() {
				return $x("apexir_CONTROL_PANEL")
			},
			this.item.worksheet_id = function() {
				return $x("apexir_NUM_ROWS")
			},
			this.item.search = function() {
				return $x("apexir_SEARCH")
			},
			this.item.search_column = function() {
				return $x("apexir_CURRENT_SEARCH_COLUMN")
			},
			this.dialog = {},
			this.dialog.check = function(e) {
				for (var tPar = html_GetTarget(e), lEl = $x("apexir_rollover"), l_Test = !0;
					"BODY" != tPar.nodeName;) tPar = tPar.parentNode,
					tPar == lEl && (l_Test = !1);
				l_Test && that.dialog.reset()
			},
			this.dialog.check2 = function(e) {
				var tPar = html_GetTarget(e),
					lEl = $x("apexir_col_values_drop");
				if (lEl) {
					for (var l_Test = !0;
						"BODY" != tPar.nodeName;) tPar = tPar.parentNode,
						tPar == lEl && (l_Test = !1);
					l_Test && $x_Remove("apexir_col_values_drop")
				}
			},
			this.dialog.colorPicker = function(pSelector) {
				apex.jQuery(pSelector).each(function() {
					var lColorPicker = apex.jQuery(this).ColorPicker({
						eventName: "xxx",
						onSubmit: function(pHsb, pHex, pRgb, pElement) {
							$s(pElement, "#" + pHex.toUpperCase()),
								apex.jQuery(pElement).ColorPickerHide()
						},
						onBeforeShow: function() {
							apex.jQuery(this).ColorPickerSetColor(this.value)
						},
						onShow: function(pElement) {
							return apex.jQuery(pElement).fadeIn("fast"), !1
						},
						onHide: function(pElement) {
							return apex.jQuery(pElement).fadeOut("fast"), !1
						}
					}).ColorPickerHide();
					lColorPicker.bind("keyup",
							function() {
								lColorPicker.ColorPickerSetColor(this.value)
							}).bind("blur",
							function() {
								lColorPicker.ColorPickerHide()
							}).bind("change",
							function() {
								this.value = this.value.toUpperCase(),
									apex.jQuery("#" + this.id + "_PREVIEW").css("background", this.value)
							}),
						apex.jQuery("#" + this.id + "_PICKER").click(function(pEvent) {
							lColorPicker.ColorPickerShow(),
								pEvent.preventDefault()
						}),
						apex.jQuery("#" + this.id + "_PREVIEW").css("background", this.value)
				})
			},
			this.dialog.reset = function() {
				that.supress_update || ($d_ClearAndHide(["searchdrop", that.item.control_panel_drop(), "apexir_SEARCHDROP"]), $x_Hide(["searchdrop", "apexir_rollover"]), $s("apexir_rollover_content", ""), $x(that.last_col_id) && $x_Class($x(that.last_col_id).parentNode, ""), that.dialog.id = !1, document.body.onclick = "", apex.jQuery(document).unbind("keydown.menu_keys_colsearch"))
			},
			this.dialog.util_exp_type = function() {
				var l_ob = {};
				return l_ob.col = $x("apexir_COLUMN_NAME"),
					l_ob.col_type = l_ob.col.options[l_ob.col.selectedIndex].className,
					l_ob.col_opt = $x("apexir_" + l_ob.col_type + "_OPT"),
					l_ob.col_opt_val = $v(l_ob.col_opt),
					l_ob.form_items = "DATE" == l_ob.col_type && "is in the last" != l_ob.col_opt_val && "is not in the last" != l_ob.col_opt_val && "is in the next" != l_ob.col_opt_val && "is not in the next" != l_ob.col_opt_val ? ["apexir_BETWEEN_FROM", "apexir_BETWEEN_TO"] : ["apexir_EXPR", "apexir_EXPR2"],
					l_ob
			},
			this.dialog.validate = function() {
				var lTest = [],
					l_OB = that.dialog.util_exp_type();
				switch (!0) {
					case "between" == l_OB.col_opt_val:
						lTest = [l_OB.form_items[0], l_OB.form_items[1]];
						break;
					case "is null" == l_OB.col_opt_val || "is not null" == l_OB.col_opt_val:
						lTest = [];
						break;
					case "is in the last" == l_OB.col_opt_val || "is not in the last" == l_OB.col_opt_val || "is in the next" == l_OB.col_opt_val || "is not in the next" == l_OB.col_opt_val:
						lTest = [l_OB.form_items[0], "apexir_EXPR3"];
						break;
					default:
						lTest = [l_OB.form_items[0]]
				}
				return $f_get_emptys(lTest, "error", "") ? !1 : l_OB
			},
			this.dialog.operator_check = function(pThis) {
				var lClass = $x("apexir_COLUMN_NAME").options[$x("apexir_COLUMN_NAME").selectedIndex].className,
					lValue = $v(pThis),
					lThis = [];
				return lThis[0] = $x("apexir_EXPR").parentNode,
					lThis[1] = $x("apexir_EXPR2").parentNode,
					lThis[2] = $x("apexir_EXPR3").parentNode,
					lThis[3] = $x("apexir_BETWEEN_FROM").parentNode,
					lThis[4] = $x("apexir_BETWEEN_TO").parentNode,
					$x_Show_Hide("apexir_EXPR_ICON", lThis),
					"is null" === lValue || "is not null" === lValue ? void $x_Hide("apexir_EXPRESSION_LABEL") : ($x_Show("apexir_EXPRESSION_LABEL"), void("DATE" === lClass && "is in the last" !== lValue && "is not in the last" !== lValue && "is in the next" !== lValue && "is not in the next" !== lValue ? ($x_Show(lThis[3]), "between" === lValue ? $x_Show(lThis[4]) : null) : ($x_Show(lThis[0]), "between" === lValue ? $x_Show(lThis[1]) : null, "is in the last" === lValue || "is not in the last" === lValue || "is in the next" === lValue || "is not in the next" === lValue ? $x_Show_Hide(lThis[2], "apexir_EXPR_ICON") : null)))
			},
			this.dialog.column_check = function(pThis) {
				var lClass = pThis.options[pThis.selectedIndex].className;
				$x_HideSiblings("apexir_" + lClass + "_OPT"),
					that.dialog.operator_check("apexir_" + lClass + "_OPT")
			},
			this.dialog.comp = function(pItem, pValue) {
				lSpace = !isNaN(pValue) || "." === pValue,
					html_ReturnToTextSelection(pValue, pItem, lSpace)
			},
			this.controls = {},
			this.controls.cancel = function() {
				that.dialog.reset()
			},
			this.controls.save_toggle = function(pThis) {
				var lTest = "NAMED" == $v(pThis) ? "apexir_SAVE_NAMED" : "apexir_SAVE_DEFAULT";
				$x_HideSiblings(lTest)
			},
			this.controls.drop = function() {
				return that.item.control_panel_drop()
			},
			this.controls.get = function(pControl, pID) {
				that.dialog.reset(),
					that.l_Action = "CONTROL",
					that.l_Type = pControl,
					that.current_control = pControl,
					that.current_dom = $x(pID),
					pID && (that.current_col_id = pID),
					that._Get("CONTROL", pControl, !1, pID)
			},
			this.controls.menu = function(pThis, pId) {
				that.dialog.reset(),
					app_AppMenuMultiOpenBottom2(pThis, pId, !1)
			},
			this.controls.widget = function(pID) {
				this.get("SORT_WIDGET", pID),
					that.current_col_dom = $x(pID),
					document.body.onclick = that.dialog.check
			},
			this.controls.narrow = function(pID) {
				that.supress_update = !0,
					that.temp_return_element = $x(pID),
					this.get("NARROW", $v("apexir_COLUMN_NAME"))
			},
			this.controls.format_mask = function(pID) {
				that.supress_update = !0,
					that.temp_return_element = $x(pID),
					this.get("FORMAT_MASK_LOV")
			},
			this.controls.col_lov = function(pID) {
				this.get("COL_LOV", pID)
			},
			this.controls.radio_lov = function(pID) {
				this.get("RADIO_LOV", pID)
			},
			this.controls.filter2 = function() {
				that.controls.set = !0,
					this.get("SHOW_FILTER")
			},
			this.group_by = {},
			this.group_by.view = function() {
				that.action("VIEW_GROUP_BY", !1, !1)
			},
			this.group_by.save = function() {
				that.supress_update = !0,
					that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1),
					that.action("GROUP_BY_SAVE")
			},
			this.group_by.remove = function() {
				that.action("GROUP_BY_REMOVE")
			},
			this.group_by.control = function(pThis) {
				var elId, numFunctions, rowNum;
				pThis && (elId = pThis.id, numFunctions = ["SUM", "AVG", "MAX", "MIN", "MEDIAN", "RATIO_TO_REPORT_SUM"], rowNum = elId.substr(elId.length - 2), -1 !== apex.jQuery.inArray($v(pThis), numFunctions) ? $x_Show_Hide("NUMBER_COLUMNS_" + rowNum, "ALL_COLUMNS_" + rowNum) : $x_Show_Hide("ALL_COLUMNS_" + rowNum, "NUMBER_COLUMNS_" + rowNum))
			},
			this.controls.row = function(pID) {
				this.get("SHOW_DETAIL", pID)
			},
			this.controls.computation = function(pID) {
				pID = pID ? pID : that.dialog.id,
					this.get("SHOW_COMPUTATION", pID),
					that.dialog.id = !1
			},
			this.controls.info = function() {
				this.get("INFO", that.current_col_id)
			},
			this.highlight = {},
			this.highlight.clear = function(pId) {
				that.action("CLEAR_HIGHLIGHT", !1, $nvl(pId, $x("HIGHLIGHT_ID").value))
			},
			this.highlight.toggle = function(pThis, pId) {
				that.action("TOGGLE_HIGHLIGHT", !1, pId, pThis.checked ? "Y" : "N")
			},
			this.highlight.save = function() {
				var l_OB = that.dialog.validate();
				l_OB && (that.supress_update = !0, that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1), that.action("SAVE_HIGHLIGHT"), l_OB = null)
			},
			this.navigate = {},
			this.navigate.paginate = function(pThis) {
				that.get.addParam("p_widget_num_return", pThis.split("max_rows=")[1].split("rows_fetched")[0]),
					that.action("PAGE", pThis)
			},
			this.column = {},
			this.column.pOb = this,
			this.column.break_on = function(pThis) {
				pThis && (that.current_col_id = pThis),
					that.action("BREAK", !1, that.current_col_id)
			},
			this.column.break_toggle = function(pThis, pId) {
				that.action("BREAK_TOGGLE", !1, pId, pThis.checked ? "Y" : "N")
			},
			this.column.hide = function(pThis) {
				var lValue = pThis ? pThis : that.current_col_id;
				that.action("HIDE", !1, lValue)
			},
			this.column.filter = function(pThis) {
				var lAction = "ADD";
				if (pThis ? (that.current_col_id = pThis, lAction = "UPDATE") : pThis = $v("apexir_COLUMN_NAME"), "COLUMN" == $v("apexir_FILTER_TYPE")) {
					var l_OB = that.dialog.validate();
					if (!l_OB) return;
					var lTemp = ["apexir_FILTER_TYPE", l_OB.col, l_OB.col_opt, l_OB.form_items[0], l_OB.form_items[1], "apexir_EXPR3"]
				} else var lTemp = ["apexir_FILTER_TYPE", "apexir_FILTER_EXPR", "apexir_FILTER_NAME"];
				that.get.AddArrayItems(lTemp, 1),
					that.supress_update = !0,
					that.action("FILTER", lAction, pThis)
			},
			this.column.filter_delete = function(pThis) {
				that.action("FILTER_DELETE", !1, pThis)
			},
			this.column.filter_toggle = function(pThis, pId) {
				that.action("FILTER_TOGGLE", !1, pId, pThis.checked ? "Y" : "N")
			},
			this.column.filter_control = function() {
				"COLUMN" == $v("apexir_FILTER_TYPE") ? ($x_Show("apexir_COLUMN_FILTER"), $x_Hide("apexir_ROW_FILTER")) : ($x_Show("apexir_ROW_FILTER"), $x_Hide("apexir_COLUMN_FILTER"))
			},
			this.column.display = function() {
				var lTemp = [],
					lSelects = $x("apexir_shuttle2").getElementsByTagName("SELECT")[0];
				for (i = 0, len = lSelects.options.length; len > i; i++) lTemp[lTemp.length] = lSelects.options[i].value;
				that.get.AddArray(lTemp, 1),
					that.action("SET_COLUMNS")
			},
			this.column.order = function(pThis) {
				"ASC" == pThis || "DESC" == pThis ? (that.get.addParam("f01", that.last_col_id), that.get.addParam("f02", pThis), that.action("COLUMN_ORDER")) : (that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1), that.action("SORT"))
			},
			this.group_by.sort = function(pThis) {
				"ASC" == pThis || "DESC" == pThis ? (that.last_col_id = pThis.id, that.get.addParam("f01", that.last_col_id), that.get.addParam("f02", pThis), that.action("GROUP_BY_COLUMN_SORT", !1, $v("apexir_GROUP_BY_ID"))) : (that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1), that.action("GROUP_BY_SORT", !1, $v("apexir_GROUP_BY_ID")))
			},
			this.column.break_save = function(pThis) {
				"ENABLE" == pThis || "DISABLE" == pThis ? (that.get.AddNameValue("apexir_COLUMN_01", that.last_col_id, 1), that.get.AddNameValue("apexir_ENABLE_01", pThis, 2)) : that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1),
					that.action("SAVE_BREAK")
			},
			this.flashback = {},
			this.flashback.save = function() {
				that.supress_update = !0,
					that.action("FLASHBACK_SET", !1, !1, $v("apexir_FLASHBACK_TIME"))
			},
			this.flashback.clear = function() {
				that.action("FLASHBACK_CLEAR", !1, !1, !1)
			},
			this.flashback.toggle = function() {
				that.action("FLASHBACK_TOGGLE", !1, !1, !1)
			},
			this.aggregate = {},
			this.aggregate.control = function() {
				var lAggregateBy, lArray;
				lAggregateBy = $v("apexir_AGGREGATE_BY"),
					lArray = ["COUNT", "COUNT_DISTINCT"], -1 !== apex.jQuery.inArray(lAggregateBy, lArray) ? $x_Show_Hide("ALL_COLUMNS", "NUMBER_COLUMNS") : $x_Show_Hide("NUMBER_COLUMNS", "ALL_COLUMNS")
			},
			this.aggregate.save = function() {
				var lAggregateBy, lAggregation, lArray, lCol;
				lAggregateBy = $v("apexir_AGGREGATE_BY"),
					lAggregation = $v("apexir_AGGREGATION"),
					lArray = ["COUNT", "COUNT_DISTINCT"],
					lCol = $v(-1 !== apex.jQuery.inArray(lAggregateBy, lArray) ? "apexir_COLUMN_NAME_ALL" : "apexir_COLUMN_NAME"),
					that.action("SAVE_AGGREGATE", !1, lAggregation, lAggregateBy, lCol)
			},
			this.aggregate.clear = function() {
				that.action("DELETE_AGGREGATE", !1, $v("apexir_AGGREGATION"))
			},
			this.aggregate.toggle = function() {},
			this.computation = {},
			this.computation.save = function() {
				var lValidate = $f_get_emptys(["apexir_COLUMN_LABEL", "apexir_COMPUTATION_EXPR"], "error", "");
				lValidate || (that.supress_update = !0, that.action("SAVE_COMPUTATION", !1, $v("apexir_COMPUTATION_ID"), $v("apexir_COLUMN_LABEL"), $v("apexir_REPORT_LABEL"), $v("apexir_FORMAT_MASK"), $v("apexir_COMPUTATION_EXPR")))
			},
			this.computation.clear = function() {
				that.action("DELETE_COMPUTATION", !1, $v("apexir_COMPUTATION_ID"))
			},
			this.computation.toggle = function() {},
			this.chart = {},
			this.chart.control = function() {
				var l_P = [];
				l_P[0] = $x("apexir_LABEL_AXIS_TITLE").parentNode,
					l_P[1] = $x("apexir_VALUE_AXIS_TITLE").parentNode,
					l_P[2] = l_P[0].previousSibling,
					l_P[3] = l_P[1].previousSibling,
					$x("apexir_CHART_TYPE_2").checked ? $x_Hide(l_P) : $x_Show(l_P)
			},
			this.chart.save = function() {
				that.supress_update = !0;
				var lTemp = ["apexir_CHART_TYPE", "apexir_CHART_LABEL", "apexir_CHART_VALUE", "apexir_AGGREGATE_BY", "apexir_LABEL_AXIS_TITLE", "apexir_VALUE_AXIS_TITLE", "apexir_SORT"];
				that.get.AddArrayItems(lTemp, 1),
					that.action("SAVE_CHART")
			},
			this.chart.clear = function() {
				that.action("DELETE_CHART")
			},
			this.chart.view = function() {
				that.action("VIEW_CHART", !1, !1)
			},
			this.email = {},
			this.email.send = function() {
				var lValidate = $f_get_emptys("apexir_EMAIL_TO", "error", "");
				if (!lValidate) {
					var lTemp = ["apexir_EMAIL_TO", "apexir_EMAIL_CC", "apexir_EMAIL_BCC", "apexir_EMAIL_SUBJECT", "apexir_EMAIL_BODY"];
					that.get.AddArrayItems(lTemp, 1),
						that.action("SEND_EMAIL")
				}
			},
			this.email.show = function() {
				$x_Show_Hide(["apexir_EMAIL", "apexir_EMAIL_BUTTON"], "apexir_DOWNLOAD_BUTTON")
			},
			this.calendar = {},
			this.calendar.save = function() {
				that.action("SAVE_CALENDAR", !1, !1, $v("DATE_COLUMN"), $v("DISPLAY_COLUMN"))
			},
			this.calendar.view = function() {
				that.action("VIEW_CALENDAR", !1, !1)
			},
			this.data = {},
			this.data.view = function(pViewMode) {
				pViewMode && that.get.addParam("p_widget_view_mode", pViewMode),
					that.action("VIEW_REPORT", !1, !1)
			},
			this.detail = {},
			this.detail.last_row_opened = !1,
			this.detail.show = function() {
				that.ajax_busy || (apex.jQuery(".displayed, .other").show(), $x("apexir_EXCLUDE_NULL_0").checked && $x("apexir_DISPLAY_OPTION").checked ? apex.jQuery(".null, .other").hide() : $x("apexir_EXCLUDE_NULL_0").checked ? apex.jQuery(".null").hide() : $x("apexir_DISPLAY_OPTION").checked && apex.jQuery(".other").hide(), that.l_Action = "CHANGE_DETAIL_OPTION", that.supress_update = !0, that.action("CHANGE_DETAIL_OPTION", !1, !1, $v("apexir_EXCLUDE_NULL_0"), $v("apexir_DISPLAY_OPTION")))
			},
			this.remove = function(pAction) {
				var lAction;
				lAction = $nvl(pAction, "DELETE"),
					that.action(lAction, !1, !1, !1)
			},
			this.reset = function() {
				that.action("RESET", !1, !1, !1)
			},
			this.save = function(pThis) {
				var l_c = $x("create_category"),
					lValidate = $f_get_emptys(["apexir_WORKSHEET_NAME"], "error", "");
				l_c && (lValidate = $f_get_emptys([l_c], "error", "")),
					lValidate || (l_cat = l_c ? l_c.value : $v("apexir_WORKSHEET_CATEGORY"), pThis = pThis ? "RENAME" : "SAVE", that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1), that.action(pThis, !1, !1))
			},
			this.get_saved_rpt_xml = function() {
				var l_Select = $x("apexir_SAVED_REPORTS"),
					get = new htmldb_Get(null, $v("pFlowId"), "INTERNAL_APPLICATION_PROCESS=ir_reports_select_xml2", $v("pFlowStepId"));
				if (get.addParam("x01", $v("apexir_WORKSHEET_ID")), get.addParam("x02", that.report_id), gReturn = get.get("XML"), gReturn && l_Select) {
					var l_Count = gReturn.getElementsByTagName("option").length;
					l_Select.length = 0;
					for (var i = 0; l_Count > i; i++) {
						var l_Opt_Xml = gReturn.getElementsByTagName("option")[i];
						that.appendToSelect(l_Select, l_Opt_Xml.getAttribute("value"), l_Opt_Xml.firstChild.nodeValue)
					}
				}
				get = null
			},
			this.appendToSelect = function(pSelect, pValue, pContent) {
				var l_Opt = document.createElement("option");
				l_Opt.value = pValue,
					document.all ? (pSelect.options.add(l_Opt), l_Opt.innerText = pContent) : (l_Opt.appendChild(document.createTextNode(pContent)), pSelect.appendChild(l_Opt))
			},
			this.save_default = function(pAction) {
				var lAction, lValidate;
				"ALTERNATIVE" === $v("apexir_DEFAULT_TYPE") && (lValidate = $f_get_emptys(["apexir_WORKSHEET_NAME"], "error", "")),
					lValidate || (lAction = $nvl(pAction, "SAVE_DEFAULT"), that.get.AddArrayItems2($x_FormItems("apexir_CONTROL_PANEL_DROP"), 1), that.action(lAction, !1, !1, !1))
			},
			this.save_default_type_check = function() {
				"PRIMARY" === $v("apexir_DEFAULT_TYPE") ? $x_ItemRow("apexir_WORKSHEET_NAME", "HIDE") : $x_ItemRow("apexir_WORKSHEET_NAME", "SHOW")
			},
			this.save_category_check = function(pThis) {
				"new" == pThis.value ? $dom_AddInput(pThis.parentNode, "text", "create_category", "") : $x_Remove("create_category")
			},
			this.pull = function(pThis, pAction) {
				pThis && (that.report_id = pThis),
					that._Get("PULL", pAction)
			},
			this.download = function() {},
			this.key = {},
			this.key.$gAnchorList,
			this.key.navigate = {},
			this.key.navigate.up = function(event) {
				var $lCurrent, lIndex;
				$lCurrent = apex.jQuery(event.target),
					lIndex = that.key.$gAnchorList.index($lCurrent),
					that.key.$gAnchorList.eq(lIndex - 1).focus(),
					event.preventDefault()
			},
			this.key.navigate.down = function(event) {
				var $lCurrent, lIndex;
				$lCurrent = apex.jQuery(event.target),
					lIndex = that.key.$gAnchorList.index($lCurrent),
					that.key.$gAnchorList.eq(lIndex + 1).focus(),
					event.preventDefault()
			},
			this.key.navigate.esc = function(event, $pReturnFocus, pEventNamespace) {
				that.dialog.reset(),
					apex.jQuery(document).unbind("keydown." + pEventNamespace),
					$pReturnFocus.focus(),
					event.preventDefault()
			},
			this.key.navigate.enter = function(pEventNamespace) {
				apex.jQuery(document).unbind("keydown." + pEventNamespace)
			},
			this.key.action = function(event, $pReturnFocus, pEventNamespace) {
				switch (event.which) {
					case 40:
						that.key.navigate.down(event);
						break;
					case 38:
						that.key.navigate.up(event);
						break;
					case 27:
						that.key.navigate.esc(event, $pReturnFocus, pEventNamespace);
						break;
					case 13:
						that.key.navigate.enter(pEventNamespace)
				}
			},
			this.notify = {},
			this.notify.save = function() {
				that.supress_update = !0;
				var lTemp = ["apexir_NOTIFY_ID", "apexir_EMAIL_ADDRESS", "apexir_EMAIL_SUBJECT", "apexir_NOTIFY_INTERVAL", "apexir_START_DATE", "apexir_START_HH", "apexir_START_AM_PM", "apexir_END_DAY", "apexir_END_DAY_UNIT"];
				that.get.AddArrayItems2(lTemp, 1),
					that.action("SAVE_NOTIFY")
			},
			this.notify.clear = function() {
				that.action("DELETE_NOTIFY", !1, $v("apexir_NOTIFY_ID"))
			},
			this.search = function(pThis, pRows) {
				var lTemp, lSearch = that.item.search(),
					lReport = (that.item.search_column(), $v("apexir_REPORT_ID"));
				(pThis = "SEARCH") && (pRows ? that.get.addParam("p_widget_num_return", pRows) : $x("apexir_NUM_ROWS") && that.get.addParam("p_widget_num_return", $v("apexir_NUM_ROWS"))),
				apex.item(lSearch).isEmpty() ? (that.get.AddArrayItems2($x_FormItems("apexir_TOOLBAR"), 1), that.pull(lReport)) : ((pThis = "SEARCH") ? (that.get.AddArrayItems2($x_FormItems("apexir_TOOLBAR"), 1), pThis = "QUICK_FILTER") : (lTemp = [this.current_col_id, "=", $v(lSearch)], pThis = "FILTER", that.get.AddArray(lTemp, 1)), that.action(pThis, "ADD")),
					$s(lSearch, "")
			},
			this.valid_action = function(pTest) {
				"true" == pTest ? that.pull() : $s("apexir_DIALOG_MESSAGE", pTest)
			},
			this.action = function(p_widget_action, p_widget_action_mod, p_id, p_value, p_x05, p_x06, p_x07, p_x08, p_x09, p_x10) {
				that.l_Action = p_widget_action,
					that._Get("ACTION", p_widget_action, p_widget_action_mod, p_id, p_value, p_x05, p_x06, p_x07, p_x08, p_x09, p_x10)
			},
			this._Get = function(p_widget_mod, p_widget_action, p_widget_action_mod, p_id, p_value, p_x05, p_x06, p_x07, p_x08, p_x09, p_x10) {
				if (!that.ajax_busy) {
					if (that.ajax_busy = !0, p_widget_mod && -1 !== apex.jQuery.inArray(p_widget_mod, ["ACTION", "PULL"]) && !that.supress_update && apex.event.trigger("#apexir_WORKSHEET", "apexbeforerefresh", that.report_id)) return void(that.ajax_busy = !1);
					if (that._Loading(), that.get.addParam("p_widget_name", "worksheet"), p_widget_mod ? that.get.addParam("p_widget_mod", p_widget_mod) : null, p_widget_action ? that.get.addParam("p_widget_action", p_widget_action) : null, p_widget_action_mod ? that.get.addParam("p_widget_action_mod", p_widget_action_mod) : null, that.get.addParam("x01", $v("apexir_WORKSHEET_ID")), that.report_id ? that.get.addParam("x02", that.report_id) : "0", p_id ? that.get.addParam("x03", p_id) : null, p_value ? that.get.addParam("x04", p_value) : null, p_x05 ? that.get.addParam("x05", p_x05) : null, p_x06 ? that.get.addParam("x06", p_x06) : null, p_x07 ? that.get.addParam("x07", p_x07) : null, p_x08 ? that.get.addParam("x08", p_x08) : null, p_x09 ? that.get.addParam("x09", p_x09) : null, p_x10 ? that.get.addParam("x10", p_x10) : null, that.external_items) {
						var l_external_items = that.external_items.split(",");
						that.get.AddPageItems(l_external_items)
					}
					that.get.GetAsync(that._Return)
				}
			},
			this._Loading = function() {
				$x_Hide("apexir_rollover"),
					that._BusyGraphic(1)
			},
			this._Finished_Loading = function() {
				if (that._BusyGraphic(4), ie) {
					that.lCSS || (that.lCSS = document.createStyleSheet()),
						startTag = '<style id="apexir_WORKSHEET_CSS" type="text/css">',
						endTag = "</style>";
					var start = p.responseText.indexOf(startTag),
						response = p.responseText.substring(start + startTag.length),
						end = response.indexOf(endTag);
					response = response.substring(0, end),
						that.lCSS.cssText = response
				}
				document.onclick = null,
					that.init(),
					gReport.websheet && gReport.websheet.init(),
					that.l_LastFunction && (that.l_LastFunction(), that.l_LastFunction = !1),
					that.ajax_busy = !1
			},
			this._BusyGraphic = function(pState) {
				1 == pState ? $x_Show("apexir_LOADER") : $x_Hide("apexir_LOADER")
			},
			this._Return = function() {
				var lSetFocusTo$;
				if (1 == p.readyState);
				else if (2 == p.readyState);
				else if (3 == p.readyState);
				else {
					if (4 != p.readyState) return !1;
					if ($x_Hide("searchdrop").innerHTML = "", "CONTROL" == that.l_Action) {
						if ("COL_LOV" == that.current_control) {
							var lBuild = new $d_LOV_from_JSON;
							lBuild.l_Type = "SELECT",
								lBuild.create(gReport.controls.lov_dom.parentNode, p.responseText),
								$s(lBuild.l_Dom, gReport.controls.value),
								lBuild.l_Dom.focus(),
								lBuild.l_Dom.id = "killme",
								apex.jQuery(lBuild.l_Dom).one("blur change",
									function(e) {
										cellsave(e, this)
									})
						} else if ("RADIO_LOV" == that.current_control) {
							var lBuild = new $d_LOV_from_JSON;
							lBuild.l_Type = "RADIO",
								lBuild.create(gReport.controls.lov_dom, p.responseText, null, null, gReport.controls.value, !0),
								lDialog.dialog({
									bgiframe: !0,
									draggable: !1,
									show: "drop",
									hide: "drop",
									modal: !0,
									position: [gReport.websheet.currentForm.offsetLeft, gReport.websheet.currentForm.offsetTop + gReport.websheet.currentForm.offsetHeight],
									close: function() {
										cellsave(null, gReport.websheet.currentForm)
									}
								}),
								apex.jQuery(":radio", gReport.controls.lov_dom).change(function() {
									$s(gReport.websheet.currentForm, this.id),
										apex.jQuery(gReport.controls.lov_dom).dialog("close")
								})
						} else if ("SORT_WIDGET" == that.current_control) {
							var myObject = $u_eval("(" + p.responseText + ")");
							that.dialog.id = myObject.dialog.id;
							var l = $x("apexir_rollover").getElementsByTagName("TABLE")[0];
							if ($x_Show_Hide([l, "apexir_sortup", "apexir_sortdown", "apexir_search", "apexir_removefilter", "apexir_hide", "apexir_break", "apexir_info", "apexir_computation"], myObject.dialog.hide), $x_Hide(myObject.dialog.hide), myObject.dialog.uv) {
								for (var len = myObject.dialog.row.length,
									i = 0; len > i; i++)
									if (null != myObject.dialog.row[i].R) {
										if (null != myObject.dialog.row[i].D) var tDisplay = myObject.dialog.row[i].D;
										else var tDisplay = myObject.dialog.row[i].R;
										var lTemp = $dom_AddTag("apexir_rollover_content", "a", tDisplay);
										lTemp.apexir_RETURN_VALUE = myObject.dialog.row[i].R,
											lTemp.href = "javascript:void(false);",
											lTemp.onclick = function() {
												var lTemp = [that.current_col_id, "=", this.apexir_RETURN_VALUE, "", ""];
												that.get.AddArray(lTemp, 1),
													that._Get("ACTION", "COL_FILTER")
											}
									}
								len > 10 ? $x_Style("apexir_rollover_content", "height", "210px") : $x_Style("apexir_rollover_content", "height", ""),
									$x_Show("apexir_rollover_content"),
									$s("apexir_search", "")
							} else $x_Hide("apexir_rollover_content");
							var pThis = $x(that.current_col_dom);
							$x_Show("apexir_rollover"),
								$x_Style("apexir_rollover", "left", findPosX(pThis.parentNode) + "px"),
								$x_Style("apexir_rollover", "top", findPosY(pThis) + pThis.offsetHeight + 5 + "px"),
								$x_Class(pThis.parentNode, "current"),
								that.last_col_id = pThis.id,
								document.body.onclick = that.dialog.check
						} else if ("SHOW_FILTER" == that.current_control || "SHOW_HIGHLIGHT" == that.current_control) {
							var lDrop = that.item.control_panel_drop();
							apex.jQuery(lDrop).html(p.responseText),
								$x_Show(lDrop),
								that.dialog.column_check($x("apexir_COLUMN_NAME"))
						} else if ("SHOW_SAVE_DEFAULT" == that.current_control) {
							var lDrop = that.item.control_panel_drop();
							$s(lDrop, p.responseText),
								$x_Show(lDrop),
								that.save_default_type_check()
						} else if ("NARROW" == that.current_control || "FORMAT_MASK_LOV" == that.current_control) {
							var lBuild = new $d_LOV_from_JSON;
							lBuild.l_Type = "a",
								lBuild.create(lDiv, p.responseText),
								lBuild.l_Dom.id = "apexir_col_values_drop",
								$x_Style(lBuild.l_Dom, "height", "200px"),
								$x_Style(lBuild.l_Dom, "display", "block"),
								$x("apexir_col_values_drop_space") || (lThis = $dom_AddTag($x(that.temp_return_element).parentNode, "BR"), lThis.id = "apexir_col_values_drop_space"),
								$x(that.temp_return_element).parentNode.appendChild(lBuild.l_Dom);
							for (var i = 0,
								len = lBuild.l_NewEls.length; len > i; i++) lTemp = lBuild.l_NewEls[i],
								lTemp.href = "javascript:void(false)",
								lTemp.onclick = "NARROW" == that.current_control ?
								function() {
									var lCol = $x("apexir_COLUMN_NAME"),
										lOpt = $x("apexir_" + lCol.options[lCol.selectedIndex].className + "_OPT"),
										l_Test = $v(lOpt);
									"in" == l_Test || "not in" == l_Test ? (l_Test = $v(that.temp_return_element), $s(that.temp_return_element, apex.item(that.temp_return_element).isEmpty() ? this.id : l_Test + "," + this.id)) : ($s(that.temp_return_element, this.id), $x_Remove("apexir_col_values_drop"), apex.jQuery("#apexir_EXPR").focus())
								} : function() {
									$s(that.temp_return_element, this.id),
										$x_Remove("apexir_col_values_drop")
								};
							that.supress_update = !1,
								that.l_Action = !1,
								apex.jQuery("#apexir_col_values_drop").on("keydown", "a",
									function(event) {
										var lAnchorList$ = apex.jQuery("#apexir_col_values_drop a"),
											lCurrentIndex = lAnchorList$.index(apex.jQuery(event.target)),
											lAnchorListLength = lAnchorList$.length - 1;
										switch (lAnchorList$.attr("tabindex", -1), event.which) {
											case 40:
												lAnchorListLength > lCurrentIndex && lAnchorList$.eq(lCurrentIndex + 1).focus(),
													event.preventDefault();
												break;
											case 38:
												lCurrentIndex > 0 && lAnchorList$.eq(lCurrentIndex - 1).focus(),
													event.preventDefault();
												break;
											case 9:
												$x_Remove("apexir_col_values_drop"),
													apex.jQuery("#apexir_btn_CANCEL").focus(),
													event.preventDefault();
												break;
											case 27:
												$x_Remove("apexir_col_values_drop"),
													apex.jQuery("#apexir_EXPR_ICON_LINK").focus(),
													event.stopImmediatePropagation()
										}
									}),
								lSetFocusTo$ = apex.jQuery("#apexir_col_values_drop a:first"),
								document.body.onclick = that.dialog.check2
						} else if ("INFO" == that.current_control) {
							var l = $x("apexir_rollover").getElementsByTagName("TABLE")[0];
							$x_Hide(l),
								$x_Show("apexir_rollover_content"),
								$s("apexir_rollover_content", p.responseText),
								$x_Style("apexir_rollover_content", "height", "");
							var pThis = $x(that.current_col_dom);
							$x_Show("apexir_rollover"),
								$x_Style("apexir_rollover", "left", findPosX(pThis.parentNode) + "px"),
								$x_Style("apexir_rollover_content", "top", findPosY(pThis) + pThis.offsetHeight + 5 + "px"),
								$x_Class(pThis.parentNode, "current"),
								that.last_col_id = pThis.id,
								document.body.onclick = that.dialog.check
						} else if ("SEARCH_COLUMN" == that.current_control) {
							var lDiv = $x("apexir_SEARCHDROP");
							$s(lDiv, "");
							var lBuild = new $d_LOV_from_JSON;
							lBuild.l_Type = "a",
								lBuild.create(lDiv, p.responseText),
								lBuild.l_Dom.id = "apexir_columnsearch";
							for (var lSearch_Col = that.item.search_column(), i = 0, len = lBuild.l_NewEls.length; len > i; i++) lBuild.l_NewEls[i].href = "javascript:void(0)",
								lBuild.l_NewEls[i].onclick = function() {
									0 != this.id ? ($s("apexir_SEARCH_COLUMN_DROP", this.innerHTML + ""), $s(lSearch_Col, this.id)) : ($s("apexir_SEARCH_COLUMN_DROP", ""), $s(lSearch_Col, "")),
										$x_Hide(lDiv),
										apex.jQuery("#apexir_SEARCH").focus(),
										apex.jQuery(document).unbind("keydown.menu_keys_colsearch")
								};
							$x_Show(lDiv),
								document.body.onclick = that.dialog.check,
								that.key.$gAnchorList = apex.jQuery("#apexir_SEARCHDROP").children().children().filter("a"),
								apex.jQuery(document).bind("keydown.menu_keys_colsearch",
									function(event) {
										var lKeyCodes = [40, 38, 27, 13];
										apex.jQuery("#apexir_SEARCHDROP:visible")[0] && -1 !== apex.jQuery.inArray(event.which, lKeyCodes) && that.key.action(event, apex.jQuery("#apexir_SEARCHDROPROOT"), "menu_keys_colsearch")
									})
						} else if ("SHOW_DETAIL" == that.current_control) $x_Hide(that.item.worksheet_report()),
							$s("apexir_DATA_PANEL", ""),
							$s("apexir_CONTROL_PANEL_DROP", ""),
							$s(that.item.worksheet_detail(), p.responseText),
							$x_Show(that.item.worksheet_detail());
						else {
							var lDrop = that.item.control_panel_drop();
							if (apex.jQuery(lDrop).html(p.responseText), "SHOW_CHART" == that.current_control && that.chart.control(), that.controls.set && ($s("apexir_COLUMN_NAME", that.last_col_id), $s("apexir_EXPR", $v("apexir_SEARCH")), that.controls.set = !1, $s("apexir_SEARCH", "")), "SHOW_COLUMN" == that.current_control) {
								if (window.g_Shuttlep_v01 = null, !flowSelectArray) var flowSelectArray = [];
								flowSelectArray[2] = $x("apexir_SHUTTLE_LEFT"),
									flowSelectArray[1] = $x("apexir_SHUTTLE_RIGHT"),
									window.g_Shuttlep_v01 = new dhtml_ShuttleObject(flowSelectArray[2], flowSelectArray[1])
							}
							$x_Show(lDrop)
						}
						void 0 === lSetFocusTo$ && (lSetFocusTo$ = apex.jQuery(":input:visible", apex.jQuery("#apexir_CONTROL_PANEL_DROP"))),
							lSetFocusTo$.length > 0 && lSetFocusTo$[0].focus()
					} else if (that.supress_update)("SAVE_NOTIFY" == that.l_Action || "SAVE_COMPUTATION" == that.l_Action || "FLASHBACK_SET" == that.l_Action || "SAVE_HIGHLIGHT" == that.l_Action || "FILTER" == that.l_Action || "GROUP_BY_SAVE" == that.l_Action || "SAVE_CHART" == that.l_Action) && (that.l_LastFunction = function() {
							that.valid_action(p.responseText)
						}),
						that.ajax_busy = !1,
						that.supress_update = !1,
						that.l_Action = !1;
					else {
						that.ajax_busy = !1,
							$x_Hide("apexir_rollover"),
							lTemp = $x("apexir_WORKSHEET"),
							lTemp.id = "apexir_WORKSHEET_old";
						var lTempToolbar = $x("apexir_TOOLBAR_OPEN");
						lTempToolbar.id = "apexir_TOOLBAR_OPEN_old";
						var lTempActionsMenu = $x("apexir_ACTIONSMENU"),
							lTempFormatMenu = $x("apexir_FORMAT_MENU"),
							lTempRowsMenu = $x("apexir_ROWS_PER_PAGE_MENU");
						lTempActionsMenu.id = "apexir_ACTIONSMENU_old",
							lTempFormatMenu.id = "apexir_FORMAT_MENU_old",
							lTempRowsMenu.id = "apexir_ROWS_PER_PAGE_MENU_old";
						var lTempManageMenu = $x("apexir_WEBSHEETMENU");
						if (lTempManageMenu) {
							var lTempManageRows = $x("apexir_ROWS"),
								lTempManageColumn = $x("apexir_COLUMN");
							lTempManageMenu.id = "apexir_WEBSHEETMENU_old",
								lTempManageRows.id = "apexir_ROWS_old",
								lTempManageColumn.id = "apexir_COLUMN_old"
						}
						lThis = $u_js_temp_drop(),
							apex.jQuery(lThis).html(p.responseText),
							lTemp.parentNode.replaceChild($x("apexir_WORKSHEET"), lTemp),
							$x("apexir_TOOLBAR_OPEN") ? (apex.jQuery("#apexir_ACTIONSMENU_old,#apexir_FORMAT_MENU_old,#apexir_ROWS_PER_PAGE_MENU_old").remove(), lTempManageMenu && apex.jQuery("#apexir_WEBSHEETMENU_old,#apexir_ROWS_old,#apexir_COLUMN_old").remove(), lTempToolbar.parentNode.replaceChild($x("apexir_TOOLBAR_OPEN"), lTempToolbar)) : (lTempActionsMenu.id = "apexir_ACTIONSMENU", lTempFormatMenu.id = "apexir_FORMAT_MENU", lTempRowsMenu.id = "apexir_ROWS_PER_PAGE_MENU", lTempManageMenu && (lTempManageMenu.id = "apexir_WEBSHEETMENU", lTempManageRows.id = "apexir_ROWS", lTempManageColumn.id = "apexir_COLUMN")),
							$d_ClearAndHide("apexir_DETAIL"),
							$s("apexir_CURRENT_SEARCH_COLUMN", ""),
							$s("apexir_SEARCH_COLUMN_DROP", ""),
							$x_Show("apexir_REPORT"),
							$u_js_temp_clear(),
							apex.jQuery("#apexir_WORKSHEET").trigger("apexafterrefresh", that.report_id)
					}
					that._Finished_Loading()
				}
			},
			this.dialog2 = this.controls.get
	}
};