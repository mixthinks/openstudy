(function($, options) {
	/**
	 * @author minjdai
	 * @desc   self service upgrade picked list >> preview email, restart initail, reselect customer contact
	 * @date 2015/4/8
	 */
	
	function createLoadingImg(){
		return $('<img  class="loading" />');
	}
	function preview(sCust, sContact, $el) {
		var preDiv = "upg-preview-to-request";
		var preDivSel = '#' + preDiv;
		var $preview = $('#' + preDiv);
		if ($preview.length == 0) {
			var preCtx = '<div id="' + preDiv + '" title="Preview Request Email"></div>';
			$(preCtx).appendTo('body');
		}
		$('#' + preDiv).empty();
		$('#' + preDiv).dialog({
			width: 700,
			resizable: true,
			open: function(event, ui) {
				createLoadingImg().appendTo(preDivSel);
				$('img.loading').css('position', 'relative')
					.css('top', $(preDivSel).height() / 2 + 'px')
					.css('left', $(preDivSel).width() / 2 + 'px');;
			}
		});
		var _sContact = sContact || '';
		apex.server.process(options.ajaxShowEmailName, {
			x01: sCust,
			x02: _sContact
		}, {
			dataType: 'text',
			success: function(data) {
				$('img.loading').remove();
				$(data).appendTo($(preDivSel));
				if ($el) $el.removeClass('entry-disable');
			}
		});
	}

	$.fn.rebindPreviewEvent = function() {
		$(this).unbind('click').click(function() {
			if ($(this).hasClass('entry-disable'))
				return false;
			var scheckCust = $(this).data('cust');
			var sContact = $(this).data('contact');
			$(this).addClass('entry-disable');
			preview(scheckCust, sContact, $(this));
		});
	};

	function restart(sCust, $el) {
		createLoadingImg().css('display','inline-block').appendTo($el);
		apex.server.process(options.ajaxRestartName, {
			x01: sCust
		}, {
			dataType: 'json',
			success: function(data) {
				if (data.type == 'SUCCESS') {
					buildNotifyMsg('Restart initial email successfully.', 'success');
				} else if (data.type == 'ERROR') {
					buildNotifyMsg('Restart initial email failed in ' + data.msg, 'warning');
				}

				if ($el) {
					$el.removeClass('entry-disable');
					$el.find('img.loading').remove();
				}
			}
		});
	}

	$.fn.rebindRestartEvent = function() {
		$(this).each(function() {
			var sContact = $(this).data('contact');
			var sEmail = $(this).data('email');
			if ($.trim(sContact) == '' || $.trim(sEmail) == '') {
				$(this).addClass('entry-disable');
			} else {
				$(this).removeClass('entry-disable');
			}
		});

		$(this).unbind('click').click(function() {
			if ($(this).hasClass('entry-disable'))
				return false;
			var scheckCust = $(this).data('cust');
			$(this).addClass('entry-disable');
			restart(scheckCust, $(this));
		});
	};

	function selectContacts(sCust, $el) {
		var contactDiv = "upg-contact-to-request";
		var contactDivSel = '#' + contactDiv;
		var $contact = $(contactDivSel);
		if ($contact.length == 0) {
			var contactCtx = '<div id="' + contactDiv + '" title="Contact for '+sCust+'"></div>';
			$(contactCtx).appendTo('body');
			$contact = $(contactDivSel);
		}
		$contact.empty();
		$contact.dialog({
			width: 600,
			resizable: true,
			open: function(event, ui) {
				$(contactDivSel).dialog( "option", "title", "Contact for "+sCust);
				createLoadingImg().appendTo($contact);
				$('img.loading').css('position', 'relative')
					.css('top', $contact.height() / 2 + 'px')
					.css('left', $contact.width() / 2 + 'px');;
			}
		});
		apex.server.process(options.ajaxContactName, {
			x01: sCust
		}, {
			dataType: 'xml',
			success: function(data) {
				$('img.loading', $contact).remove();
				var contact_render = new ContactRender(data, $el);
				contact_render.appendTo($contact);
				if ($el) {
					$el.removeClass('entry-disable');
				}
			}
		});
	}

	function ContactRender(xmldata, $el) {
		this.data = xmldata;
		this.trigger = $el;
		this.cust_report_header = "CUSTOMER_NAME";
		this.contact_report_header = "CONTCAT_NAME";
		this.email_report_header = "CONTACT_EMAIL";
		this.type_report_header = "CONTACT_TYPE";
		this.cust = $el.data("cust");
		this.checked_property = "$$CHECKED$$";
		this.contact_property = "FIRST_NAME";
		this.email_property = "EMAIL";
		this.contact_code_property = "CONTACT_CODE";
		this.contact_type_property = "CONTACT_TYPE";
		this.parsed = {};
		this.$render = "";
		this.isRadio = this.trigger.data('radio')? true:false;
		this.render();
	}
	ContactRender.prototype = {
		render: function() {
			this.parseData();
			this.generateDom();
		},
		parseData: function() {
				var _this = this,
					$el = this.trigger,
					xmldata = this.data,
					checked_property = this.checked_property;
				var scolumns = $el.data("columns"),
					scontacts = $el.data('contact')+"",
					semails = $el.data('email'),
					scodes = $el.data('code');
				scolumns = scolumns.split(',')
				scontacts = scontacts.split(",");
				semails = semails.split(",");
				if(scodes)scodes = scodes.split(",");
				var header_names = [],
					rows = [];
				var $xmlRoot = $(xmldata).find("CONTACTS");
				$xmlRoot.find("CONTACT").each(function() {
					var rowObj = {};
					var $children = $(this).children();
					for (var i = 0, j = $children.length; i < j; i++) {
						var $child = $($children[i]);
						var tag = $child.prop('tagName');
						var tagValue = $child.text();
						rowObj[tag] = tagValue;
						if (scolumns.length == 0 || $.inArray(tag, scolumns) != -1) { //just show configure columns
							if (header_names.length < scolumns.length) {
								header_names.push(tag);
							} // end store header name;
						}
					}
					if (rowObj[_this.contact_property] 
						&& rowObj[_this.email_property] 
						//&& rowObj[_this.contact_code_property] 
						&& $.inArray(rowObj[_this.contact_property], scontacts) != -1 
						&& $.inArray(rowObj[_this.email_property], semails) != -1 
						//&& $.inArray(rowObj[_this.contact_code_property], stypes) != -1
					) {
						rowObj[_this.checked_property] = true;
					}
					rows.push(rowObj);
				}); // end of xml parse
				this.parsed = {
					header: header_names,
					rowData: rows
				}
			} // end of function parseData
			,
		generateDom: function() {
				var sContent = "",
					header_names = this.parsed.header,
					rows = this.parsed.rowData,
					isRadio = this.isRadio;
				for (var i = 0, j = header_names.length; i < j; i++) {
					sContent = sContent + "<th class='reselct_contacts_header' headers='" + header_names[k] + "'>" + header_names[i].toPascalCase(" ") + "</th>";
				}
				if (sContent.length > 0) {
					var tmp1 = '<tr>' + '<th class="reselct_contacts_header" headers="SELECT_ALL_BOX"><input type="checkbox" data-row="0"/></th>' + sContent + "</tr>";
					var tmp2 = '<tr>' + '<th class="reselct_contacts_header" headers="SELECT_ALL_BOX">&nbsp;</th>' + sContent + "</tr>";
					sContent =  isRadio?tmp2:tmp1;
				}
				for (var i = 0, j = rows.length; i < j; i++) {
					var rowObj = rows[i];
					if(isRadio){
						sContent = sContent + '<tr><td headers="SELECT_BOX"><input name="contact_radios" type="radio" data-row="' + (i + 1) + '"/></td>'
					}else{
						sContent = sContent + '<tr><td headers="SELECT_BOX"><input type="checkbox" data-row="' + (i + 1) + '"/></td>';
					}
					for (var k = 0, m = header_names.length; k < m; k++) {
						sContent = sContent + "<td headers='" + header_names[k] + "'>" + rowObj[header_names[k]] + "</td>";
					}
					sContent = sContent + '</tr>';
				}
				sContent = '<table class="reselct_contacts">' + sContent + '</table>';
				if( rows.length == 0 ){
					sContent = '<span class="nodatafound">no data found</span>';
				}
				var $content = $(sContent);
				this.$render = $content;
				this.setInitalValue();
				this.bindEvent();
				return $content;
			} // end of function generateDom
			,
		setInitalValue: function() {
				var checked_count = 0;
				var checked_property = this.checked_property;
				var rows = this.parsed.rowData;
				var $content = this.$render;
				for (var i = 0, j = rows.length; i < j; i++) {
					var rowObj = rows[i];
					if (rowObj[checked_property] && rowObj[checked_property] == true) {
						$('input[data-row="' + (i + 1) + '"]', $content).prop("checked", true);
						checked_count++;
					}
				}
				if (checked_count == rows.length) {
					$('input[data-row="0"]', $content).prop("checked", true);
				}
			} // end of function setInitalValue
			,
		bindEvent: function() {
			var _this = this;
			$("input[type=checkbox][data-row][data-row=0]", this.$render).click(function() {
				var isChecked = $(this).prop("checked");
				$("input[data-row][data-row!=0]", this.$render).prop("checked", isChecked);
				var checkeds = [];
				if (isChecked) {
					for (var i = 0, j = _this.parsed.rowData.length; i < j; i++) {
						checkeds.push((i + 1));
					}
				}
				_this.updateContact(checkeds);
			});
			var regiset_type =_this.isRadio?'radio':'checkbox';
			$("input[type="+regiset_type+"][data-row][data-row!=0]", this.$render).click(function() {
				var checkeds = [],
					index = 0,
					isChecked = $(this).prop("checked");
				if(!isChecked){
					$("input[type="+regiset_type+"][data-row][data-row=0]", this.$render).prop("checked", false);
				}
				$("input:checked[data-row][data-row!=0]", this.$render).each(function() {
					var row_index = $(this).data("row");
					checkeds[index] = parseInt(row_index);
					index++;
				});
				_this.updateContact(checkeds);
			});
			
			
		},
		updateContact: function(checkedrows) {
			var _this = this,
				rows = this.parsed.rowData;
			var ck_rows = checkedrows || [],
				sContacts = "",
				sEmails = "",
				sCodes = "",
				sTypes = "";
			for (var i = 0, j = ck_rows.length; i < j; i++) {
				var row_index = parseInt(ck_rows[i]) - 1;
				sContacts = sContacts + rows[row_index][this.contact_property] + ",";
				var _email = rows[row_index][this.email_property];
				if(sEmails.toUpperCase().indexOf(_email.toUpperCase()) == -1){// check duplicate
					sEmails = sEmails + rows[row_index][this.email_property] + ",";
				}
				sCodes = sCodes + rows[row_index][this.contact_code_property] + ",";
				sTypes = sTypes + rows[row_index][this.contact_type_property] + ",";
			}
			if (ck_rows.length > 0) {
				sContacts = sContacts.substr(0, sContacts.length - 1);
				sEmails = sEmails.substr(0, sEmails.length - 1);
				sCodes = sCodes.substr(0, sCodes.length - 1);
				sTypes = sTypes.substr(0, sCodes.length - 1);
			}
			apex.server.process(options.ajaxStoreCustContactName, {
				x01: _this.cust,
				x02: sContacts,
				x03: sEmails,
				x04: sCodes
			}, {
				dataType: 'json',
				success: function(data) {
					$("td[headers=" + _this.cust_report_header + "]").each(function() {
						var $td = $(this);
						if ($td.text().trim() == _this.cust) {
							var $tr = $td.parent();
							$("td[headers=" + _this.contact_report_header + "]", $tr).text(sContacts);
							$("td[headers=" + _this.email_report_header + "]", $tr).text(sEmails);
							$("td[headers=" + _this.type_report_header + "]", $tr).text(sTypes);
						}
					});
				}
			});
		},
		appendTo: function($parent) {
			var $content = this.$render;
			if ($content) {
				$content.appendTo($parent);
			}
		}
	};

	$.fn.rebindContactEvent = function() {
		$(this).unbind('click').click(function() {
			if ($(this).hasClass('entry-disable'))
				return false;
			var scheckCust = $(this).data('cust');
			$(this).addClass('entry-disable');
			selectContacts(scheckCust, $(this));
		});
	}

	function unscheduleCust(sCust,$el){
		createLoadingImg().css('display','inline-block').appendTo($el);
		apex.server.process(options.ajaxUnscheduleName, {
			x01: sCust
		}, {
			dataType: 'json',
			success: function(data) {
				if (data.type == 'SUCCESS') {
					buildNotifyMsg('Upgrade Confirmation SR not received, unscheduled successfully.', 'success');
				} else if (data.type == 'ERROR') {
					buildNotifyMsg('Upgrade Confirmation SR not received, unscheduled successfully failed in ' + data.msg, 'warning');
				}

				if ($el) {
					$el.removeClass('entry-disable');
					$el.find('img.loading').remove();
				}
			}
		});
	}
	$.fn.rebindUnscheduleEvent=function(){
		$(this).unbind('click').click(function(){
			if ($(this).hasClass('entry-disable'))
				return false;
			var scheckCust = $(this).data('cust');
			$(this).addClass('entry-disable');
			unscheduleCust(scheckCust, $(this));
		})
	}
	
	function clearCustEmailHistory(sCust,$el){
		createLoadingImg().css('display','inline-block').appendTo($el);
		apex.server.process(options.ajaxClearEmailName, {
			x01: sCust
		}, {
			dataType: 'json',
			success: function(data) {
				if (data.type == 'SUCCESS') {
					buildNotifyMsg('Clear customer email history successfully.', 'success');
				} else if (data.type == 'ERROR') {
					buildNotifyMsg('Clear customer email history failed in ' + data.msg, 'warning');
				}

				if ($el) {
					$el.removeClass('entry-disable');
					$el.find('img.loading').remove();
				}
			}
		});
	}
	
	$.fn.rebindClearEmailEvent=function(){
		$(this).unbind('click').click(function(){
			if ($(this).hasClass('entry-disable'))
				return false;
			var scheckCust = $(this).data('cust');
			$(this).addClass('entry-disable');
			clearCustEmailHistory(scheckCust, $(this));
		})
	}

})(apex.jQuery, {
	ajaxShowEmailName: 'Print_Upgrade_Request_Email',
	previewElement: '.preview-cust-list-entry',
	ajaxRestartName: 'Restart_Upgrade_Request',
	restartElement: '.restart-cust-list-entry',
	ajaxContactName: 'Reselect_Cust_Contact',
	contactElement: 'contact-cust-list-entry',
	ajaxStoreCustContactName: 'Update_Cust_Contact',
	affectedElement: '#picked-cust-list',
	ajaxUnscheduleName: 'Unschedule_Upgrade_Request',
	unscheduleElement:'.unschedule-cust-list-entry',
	ajaxClearEmailName:'Clear_Cust_Email_History',
	clearEmailElement:'.clear-cust-list-entry'
});

//$('.preview-cust-list-entry').rebindPreviewEvent();
//$('.restart-cust-list-entry').rebindRestartEvent();
//$('.contact-cust-list-entry').rebindContactEvent();