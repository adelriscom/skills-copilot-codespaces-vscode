function skillsMember() {
  var skills = document.getElementById("skills");
  var skillsMember = document.getElementById("skillsMember");
  var skillsMemberValue = skillsMember.value;
  var skillsMemberText = skillsMember.options[skillsMember.selectedIndex].text;
  var skillsMemberTextValue = skillsMemberText + " : " + skillsMemberValue;
  var skillsMemberTextValueLength = skillsMemberTextValue.length;

  if (skillsMemberTextValueLength > 0) {
    skills.innerHTML += "<li>" + skillsMemberTextValue + "</li>";
  }
}

