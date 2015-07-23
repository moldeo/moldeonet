function LaunchProject(event) {

	if (moCI && moCI.Browser) {
		moCI.Browser.OpenFile( event );
	}

}