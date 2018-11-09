var QuranIndex = [];

var JuzaNumber = $("#JuzaNumber");

var SurahNumber = $("#SurahNumber");

var QuranPageNumber = $("#QuranPageNumber");

var AutoContinue = $("#AutoContinue");

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

		if (localStorage.AutoContinue)
		{
			if (localStorage.AutoContinue == -1)
			{
				AutoContinue.prop('checked', false);
			}
			else if(parseInt(localStorage.AutoContinue) > 0)
			{
				AutoContinue.prop('checked', true);
				//TurnPage(parseInt(localStorage.AutoContinue));
				InitPage = parseInt(localStorage.AutoContinue) + 3;
			}
		}
		else
		{
			localStorage.AutoContinue = -1;
			AutoContinue.prop('checked', false);
		}
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

	AutoContinue.change(function()
	{
		SaveCurrentPage();
	});
});

function TurnPage(QPageNumber)
{
	$(magazine).turn("page", QPageNumber + 3);
}

function QuranPageChanged(Page)
{
	var QPageNumber = Page - 3;
	var JuzaNumberValue;
	var SurahNumberValue;

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
				SurahNumberValue = QuranIndex[i][0];
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

	SaveCurrentPage();
}

function SaveCurrentPage()
{
	if(AutoContinue.is(":checked"))
	{
		if (CurrentPage - 3 > 0)
		{
			localStorage.AutoContinue = CurrentPage - 3;
		}
		else
		{
			localStorage.AutoContinue = 1;
		}
	}
	else
	{
		localStorage.AutoContinue = -1;
	}
}