!function(l){function e(t){var e=l("#tvr-decoded > nav > div > button.active").attr("id"),e=e.charCodeAt(e.length-5)-48;(t?(l("#tvr-decoded > nav").hide(),l("#tvr-decoded > div.tab-content").children("div").addClass("flat"),l("#tvr-decoded > div.tab-content").children("div").addClass("show"),l("#tvr-decoded > div.tab-content").children("div")):(l("#tvr-decoded > nav").show(),l("#tvr-decoded > div.tab-content").children("div").removeClass("flat"),l("#tvr-decoded > div.tab-content").children("div").removeClass("show"),l("#tvr-decoded > div.tab-content").children("div").removeClass("active"),l("#tvr-decoded > div.tab-content").children("div").eq(e-1).addClass("show"),l("#tvr-decoded > div.tab-content").children("div").eq(e-1))).addClass("active")}function d(){l("#tvr-decoded").empty(),tvrvalue=validateInput(l("#input-tvr"),/^[0-9a-fA-F]{10}$/);var t=new URL(window.location.href);if(t.searchParams.set("value",tvrvalue),window.history.replaceState(null,null,t),!l("#input-tvr").hasClass("is-invalid")){l("#input-tvr-flat").parent().show();let t="false";null!==localStorage.getItem("tvr-flat")&&(t=localStorage.getItem("tvr-flat")),l("#input-tvr-flat").prop("checked","true"===t),l("#tvr-decoded").append(GetTVRControl(tvrvalue)),e("true"===t)}}l(function(){l("#tvr").append(`<h1>Tag 95 - TVR (Terminal Verification Results) Decoder</h1>

		<form>
			<div class="row mb-2 align-items-center">
				<label class="text-md-end col-1 col-form-label col-form-label-sm pe-0 tight4">TVR</label>
				<div class="col-md d-flex">
					<input class="col-12 form-control form-control-sm" type="tel" maxlength="10" placeholder="10 hex digits" id="input-tvr" style="width: 250px;">
					<div class="ps-2 text-nowrap valid-feedback"></div>
					<div class="ps-2 text-nowrap invalid-feedback"></div>
				</div>
			</div>
			
			<div class="row">
				<label class="text-sm-end col-1 col-form-label col-form-label-sm tight4"></label>
				<div class="col-md">
					<div class="d-flex position-relative" style="width:250px;">
						<button id="button-tvr-decode" class="btn btn-sm btn-primary">Decode</button>
						<div class="form-check form-switch pe-0 ps-0 position-absolute end-0" style="top:20%; display:none">
							<label class="form-check-label" for="input-tvr-flat">Flat</label>
							<input class="form-check-input float-none" type="checkbox" style="margin-left: unset!important;" id="input-tvr-flat">
						</div>
					</div>
				</div>
			</div>
			
			<div class="row align-items-center">
				<label class="text-sm-end col-1 col-form-label col-form-label-sm tight4"></label>
				<div id="tvr-decoded" class="col-md pt-3"></div>
			</div>
		</form>`);var t=new URLSearchParams(window.location.search);t.has("value")&&(t=t.get("value"),resetStatus(l("#input-tvr")),l("#input-tvr").val(t),d()),l("#input-tvr-flat").on("change",function(){localStorage.setItem("tvr-flat",l(this).is(":checked")),e(l(this).is(":checked"))}),l("#input-tvr").on("change paste input",function(){resetStatus(l(this)),l("#tvr-decoded").empty(),l("#input-tvr-flat").parent().hide()}),applyInputFilter(l("#input-tvr"),"0-9a-fA-F"),l("#button-tvr-decode").click(function(t){t.preventDefault(),d()})})}(jQuery);