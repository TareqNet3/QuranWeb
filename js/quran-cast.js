var QuranIndex = [];

var ConnectButton = $("#ConnectButton");

var ConnectButtonIcon = $("#ConnectButtonIcon");

var JuzaNumber = $("#JuzaNumber");

var SurahNumber = $("#SurahNumber");

var QuranPageNumber = $("#QuranPageNumber");

var UpdateCurrentPage = $("#UpdateCurrentPage");

var NextButton = $("#NextButton");

var PrevButton = $("#PrevButton");

$(document).ready(function()
{
	$.getJSON("data/QuranIndex.json", function (data)
	{
		QuranIndex = data;

		var Ajzaa = [];
		var Suar = [];

		var AjzaaNumber = 0;
		var SuarNumber = 0;

		for (var i = 0; i < QuranIndex.length; i++)
		{
			var r = QuranIndex[i];

			if (i == 0)
			{
				Ajzaa.push([r[2], r[3]]);
				Suar.push([r[0], r[1]]);

				AjzaaNumber = 1;
				SuarNumber = 1;
			}
			else
			{
				if (r[2] != Ajzaa[AjzaaNumber - 1][0])
				{
					Ajzaa.push([r[2], r[3]]);
					AjzaaNumber++;
				}

				if (r[0] != Suar[SuarNumber - 1][0])
				{
					Suar.push([r[0], r[1]]);
					SuarNumber++;
				}
			}
		}

		for (var i = 0; i < Ajzaa.length; i++)
		{
			JuzaNumber.append('<option value="' + Ajzaa[i][0] + '">' + Ajzaa[i][1] + '</option>');
		}

		for (var i = 0; i < Suar.length; i++)
		{
			SurahNumber.append('<option value="' + Suar[i][0] + '">' + Suar[i][1] + '</option>');
		}

		for (var i = 1; i <= 604; i++)
		{
			QuranPageNumber.append('<option value="' + i + '">' + i + '</option>');
		}
	});

	ConnectButton.click(function() {
		ConnectCast(function() {
			if (session && session.status == "connected")
			{
				ConnectButtonIcon.innerHTML = "cast_connected";
			}
			else
			{
				ConnectButtonIcon.innerHTML = "cast";
			}
		}, function() {
			if (session && session.status == "connected")
			{
				ConnectButtonIcon.innerHTML = "cast_connected";
			}
			else
			{
				ConnectButtonIcon.innerHTML = "cast";
			}
		});
	});

	JuzaNumber.change(function()
	{
		var JuzaNumberValue = parseInt(JuzaNumber.val());

		var QPageNumber;

		for (var i = 0; i < QuranIndex.length; i++)
		{
			var r = QuranIndex[i];
			if (r[2] == JuzaNumberValue)
			{
				QPageNumber = parseInt(r[4]);
				break;
			}
		}

		TurnPage(QPageNumber);
	});

	SurahNumber.change(function()
	{
		var SurahNumberValue = parseInt(SurahNumber.val());

		var QPageNumber;

		for (var i = 0; i < QuranIndex.length; i++)
		{
			var r = QuranIndex[i];
			if (r[0] == SurahNumberValue)
			{
				QPageNumber = parseInt(r[4]);
				break;
			}
		}

		TurnPage(QPageNumber);
	});

	QuranPageNumber.change(function()
	{
		var QPageNumber = parseInt(QuranPageNumber.val());

		TurnPage(QPageNumber);
	});

	UpdateCurrentPage.click(function() {
		var QPageNumber = parseInt(QuranPageNumber.val());

		TurnPage(QPageNumber);
	});

	NextButton.click(function() {
		NextPage();
	});

	PrevButton.click(function() {
		PreviousPage();
	});

	$(document).keydown(function (e) {
		var previous = 39, next = 37, esc = 27;

		switch (e.keyCode)
		{
			case previous:
				PreviousPage();
				e.preventDefault();
				break;
			case next:
				NextPage();
				e.preventDefault();
				break;
		}
	});
});

function NextPage()
{
	var QPageNumber = parseInt(QuranPageNumber.val());

	QPageNumber += 2;

	TurnPage(QPageNumber);
}

function PreviousPage()
{
	var QPageNumber = parseInt(QuranPageNumber.val());

	QPageNumber -= 2;

	TurnPage(QPageNumber);
}

function TurnPage(QPageNumber)
{
	//$(magazine).turn("page", QPageNumber + 3);
	QuranPageChanged(QPageNumber);
}

function QuranPageChanged(QPageNumber)
{
	var JuzaNumberValue;
	var SurahNumberValue;
	var JuzaName;
	var SurahName;

	for (var i = 0; i < QuranIndex.length; i++)
	{
		try
		{
			var r = QuranIndex[i];
			var rp1 = QuranIndex[i + 1];

			rPageNumber = r[4];
			rp1PageNumber = rp1[4];

			if (QPageNumber >= rPageNumber &&  QPageNumber < rp1PageNumber)
			{
				JuzaNumberValue = QuranIndex[i][2];
				JuzaName = QuranIndex[i][3];
				SurahNumberValue = QuranIndex[i][0];
				SurahName = QuranIndex[i][1];
				break;
			}
		}
		catch(ex)
		{
		}
	}

	JuzaNumber.val(JuzaNumberValue);

	SurahNumber.val(SurahNumberValue);
	
	QuranPageNumber.val(QPageNumber);

	CastUpdate(JuzaName, SurahName, QPageNumber);
}