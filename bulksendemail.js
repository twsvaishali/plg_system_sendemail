/*
 * @version    SVN:<SVN_ID>
 * @package    TJsendemail
 * @author     Techjoomla <extensions@techjoomla.com>
 * @copyright  Copyright (c) 2009-2018 TechJoomla. All rights reserved
 * @license    GNU General Public License version 2, or later
 */


var tjutilitysendemail = {
    initialize: function(tableContainer) {
		var isSendEmail = jQuery('body').find('.td-sendemail').length;

		if (isSendEmail)
		{
			this.addColumn(tableContainer);
			this.btnSendEmail();
		}
    },
    addColumn: function(tblId)
	{
		var tr = document.getElementById(tblId).tHead.children[0];
		tr.insertCell(0).outerHTML = '<th><input type="checkbox" name="checkall-toggle" value="" class="hasTooltip" title="Check All Items" onclick="Joomla.checkAll(this)"></th>'

		var tblBodyObj = document.getElementById(tblId).tBodies[0];
		for (var i=0; i<tblBodyObj.rows.length; i++) {
			var newCell = tblBodyObj.rows[i].insertCell(0);
			newCell.innerHTML = '<input type="checkbox" id="cb0" name="cid[]" value="' + i + '" onclick="Joomla.isChecked(this.checked);">'
		}
	},
	btnSendEmail: function () {
		try {
			var alertMessage = 'alert("Please select recods");';
			let btnHtml = '<div class="btn-wrapper" id="tj-sendemail" style="float: right;">';
					btnHtml += '<button type="button" class="btn btn-primary" id="email-queue-column" data-toggle="modal" data-target="#builkEmailModal" onclick="tjutilitysendemail.openEmailPopup();">';
						btnHtml += Joomla.JText._('PLG_SYSTEM_SENDEMAIL_BTN') ;
					btnHtml += '</button>';
				btnHtml += '</div>';

			jQuery('#toolbar').append(btnHtml);

		}
		catch (err) {
			/*console.log(err.message);*/
		}
	},
	openEmailPopup: function () {
		try {

			if (document.adminForm.boxchecked.value==0)
			{
				alert("Please select recods");
				return false;
			}

			// Remove below line removeclass it is temp added
			jQuery("div").find('.tjlms-wrapper').removeClass("tjBs3");

			let modelEmail = '<div id="builkEmailModal" class="emailModal modal fade" role="dialog">';
					modelEmail += '<div class="modal-dialog">';
						modelEmail += '<div class="modal-content">';
								modelEmail += '<div class="modal-header">';
									modelEmail += '<div class="row-fluid">';
										modelEmail += '<div class="span10">';
											modelEmail += '<h5 class="modal-title" id="exampleModalLabel">Email Notification</h5>';
										modelEmail += '</div>';
										modelEmail += '<div class="span2">';
											modelEmail += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
										modelEmail += '</div>';
									modelEmail += '</div>';
									modelEmail += '<span id="errorMessage"></span>';
								modelEmail += '</div>';

								modelEmail += '<div class="modal-body">';
									modelEmail += '<div class="container-fluid">';
										modelEmail += '<form action="#" method="post" enctype="multipart/form-data" name="emailTemplateForm" id="emailTemplateForm" class="form-validate">';
											modelEmail += '<div class="row-fluid">';
												modelEmail += '<div class="span12">';
													modelEmail += '<div class="control-group">';
														modelEmail += '<div class="control-label">';
															modelEmail += '<label id="email-subject-label" for="email-subject" class="hasPopover required" title="" >';
																modelEmail += 'Subject <span class="star">&nbsp;*</span>';
															modelEmail += '</label>';
														modelEmail += '</div>';

														modelEmail += '<div class="controls">';
															modelEmail += '<input type="text" name="template[subject]" id="email-subject" value="" class="required" required="required" aria-required="true">';
														modelEmail += '</div>';
													modelEmail += '</div>';
													modelEmail += '<div class="control-group">';
														modelEmail += '<div class="control-label">';
															modelEmail += '<label id="email-message-label" for="email-message" class="hasPopover required" title="" >';
																modelEmail += 'Email Text <span class="star">&nbsp;*</span>';
															modelEmail += '</label>';
														modelEmail += '</div>';
														modelEmail += '<div class="controls">';
															modelEmail += '<textarea name="template[message]" rows="7" style="width: 30%;" id="email-message" value="" class="required" required="required" aria-required="true"></textarea>';
														modelEmail += '</div>';
													modelEmail += '</div>';
												modelEmail += '</div>';
												modelEmail += '<div id="emailsDiv"></div>';
											modelEmail += '</div>';
										modelEmail += '</div>';
									modelEmail += '</form>';
								modelEmail += '</div>';
								modelEmail += '<div class="modal-footer">';
									modelEmail += '<button type="button" class="btn btn-primary validate" id="send-email" onclick="tjutilitysendemail.sendEmailToUser();">Send</button>';
								modelEmail += '</div>';
						modelEmail += '</div>';
					modelEmail += '</div>';
				modelEmail += '</div>';

			// Confirm this class to append popup
			jQuery('#j-main-container').append(modelEmail);

			var values = new Array();
			jQuery("#emailsDiv").empty();
			jQuery.each(jQuery("input[name='cid[]']:checked").closest("td").siblings("td.td-sendemail"), function () {
				values.push(jQuery(this).text());

				var hiddenEle = "<input readonly type='hidden' name='emails[]' value='" + jQuery(this).text() + "'/>";
				jQuery("#builkEmailModal").find("#emailsDiv").append(hiddenEle);
			});

			// alert(values.join (", "));
		}
		catch (err) {
			/*console.log(err.message);*/
		}
	},
	sendEmailToUser: function () {
		var postData = jQuery("#emailTemplateForm").serialize();

		var emailSubjectValue = jQuery("#email-subject").val();
		var emailMessageValue = jQuery("#email-message").val();
		var invalidCount = 0;

		if (!emailSubjectValue)
		{
			invalidCount = 1;

			jQuery('#email-subject').addClass("invalid");
			jQuery('#email-subject-label').addClass("invalid");
		}

		if (!emailMessageValue)
		{
			invalidCount = 1;

			jQuery('#email-message').addClass("invalid");
			jQuery('#email-message-label').addClass("invalid");
		}

		if (invalidCount)
		{
			return false;
		}

		jQuery.ajax(
		{
			type: "POST",
			url: "index.php?option=com_ajax&plugin=plg_System_Sendemail&format=json",
			data:postData,
			success: function(data)
			{
				 var response = jQuery.parseJSON(data);

				 if (response.success)
				 {
					 jQuery('#builkEmailModal').modal('hide');

					 // Remove below line removeclass it is temp added
					 jQuery("div").find('.tjlms-wrapper').addClass("tjBs3");

					 Joomla.renderMessages({"success":[response.message]});
				 }
				 else
				 {
					 var errormsg = '<div class="alert alert-error alert-danger"><button type="button" data-dismiss="alert" class="close">×</button><h4 class="alert-heading"></h4><div>' + response.message + '</div></div>';
						jQuery("#builkEmailModal").find("#errorMessage").append(errormsg);
				 }

				 // console.log(response.success);
			}
		});
	}
};
