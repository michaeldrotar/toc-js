jasmine.getFixtures().fixturesPath = location.protocol === "file:" ? "fixtures" : "/base/spec/fixtures";

describe("toc-js", function() {
	var result;
	
	beforeEach(function() {
		loadFixtures("toc.fixture.html");
	});
	
	describe("instantiates a table of contents with default settings", function() {
		beforeEach(function() {
			result = $(toc());
		});
		
		it("and includes all elements", function() {
			expect(result.find("li")).toHaveLength($(toc.defaults.selector).length+1); // +1 skipped
		});
		
		it("and contains sub-lists", function() {
			expect(result.find("ol > li > ol")).toHaveLength(9);
		});
		
		it("and assigns class names", function() {
			expect(result.find(".skipped")).toHaveLength(1);
			expect(result.find(".h3")).toHaveLength($("h3").length);
			expect(result.find(".a")).toHaveLength($("a[name]:not(.toc-anchor)").length);
		});
	});
	

/*
	it("should be able to play a Song", function() {
		player.play(song);
		expect(player.currentlyPlayingSong).toEqual(song);

		//demonstrates use of custom matcher
		expect(player).toBePlaying(song);
	});

	describe("when song has been paused", function() {
		beforeEach(function() {
			player.play(song);
			player.pause();
		});

		it("should indicate that the song is currently paused", function() {
			expect(player.isPlaying).toBeFalsy();

			// demonstrates use of 'not' with a custom matcher
			expect(player).not.toBePlaying(song);
		});

		it("should be possible to resume", function() {
			player.resume();
			expect(player.isPlaying).toBeTruthy();
			expect(player.currentlyPlayingSong).toEqual(song);
		});
	});

	// demonstrates use of spies to intercept and test method calls
	it("tells the current song if the user has made it a favorite", function() {
		spyOn(song, 'persistFavoriteStatus');

		player.play(song);
		player.makeFavorite();

		expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
	});

	//demonstrates use of expected exceptions
	describe("#resume", function() {
		it("should throw an exception if song is already playing", function() {
			player.play(song);

			expect(function() {
				player.resume();
			}).toThrow("song is already playing");
		});
	});
*/
});