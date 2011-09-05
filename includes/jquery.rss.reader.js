/*
    jQuery RSS Reader is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, version 2 of the License.
 
    jQuery RSS Reader is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    For a copy of the GNU General Public License please see 
	<http://www.gnu.org/licenses/>.
*/
(function($){  
	$.fn.rssReader = function(options) { 
	
		// Extend our default options with those provided.
		// Note that the first arg to extend is an empty object -
		// this is to keep from overriding our "defaults" object.
		var opts = $.extend({}, $.fn.rssReader.defaults, options); 
		
		/* Get the id of the element where the RSS Feed will be written */
		var elementID = '#' + $(this).attr('id');	

		return this.each(function() { 
		
			/* Internal vars */
			var settings = {				
				dom: {
					itemID: '#rss-reader-item',
					titleID: '#rss-reader-title',
					descriptionID: '#rss-reader-description',
					publishDateID: '#rss-reader-publishdate',
					creatorID: '#rss-reader-creator'
				}
			};
			
			// lets go...
			processContent();

			/* Function for handling debug and error messages */ 
			function debugError(obj) {
				if (opts.debugMode) {
					if (window.console && window.console.log) {
						window.console.log(obj);
					}
					else {
						alert(obj);			
					}
				}
			}	

			/* Process the feed */
			function processContent() {
			
				$.ajax({
					url: opts.feedUrl,
					cache: false,
					dataType: opts.feedType,
					async: true,
					success: function(data){

						//Declare Count Variable
						count = 0;
					
						// Get the 'root' node
						for (var a = 0; a < data.childNodes.length; a++) {
							if (data.childNodes[a].nodeName == 'rss') {
								xmlContent = data.childNodes[a];
							}
						}
						
						// Find the channel node
						for (var i = 0; i < xmlContent.childNodes.length; i++) {
							if (xmlContent.childNodes[i].nodeName == 'channel') {
								xmlChannel = xmlContent.childNodes[i];
							}		
						}
						
						// for each item extract feed data and build array content
						for (var x = 0; x < xmlChannel.childNodes.length; x++) {
						
							//Verify if we have appended the required number of items
							if(count = opt.limit) break;
						
							// Verify we are working with the items node
							if (xmlChannel.childNodes[x].nodeName == 'item') {
							
								// Declare a variable for the item nodes collection
								xmlItems = xmlChannel.childNodes[x];
								
								//Declare local variables
								var title, link, pubDate, creator, description = false;
								
								//Iterate over the items collection
								for (var y = 0; y < xmlItems.childNodes.length; y++) {
								
									//Verify which node element we have and set the local variable
									switch(xmlItems.childNodes[y].nodeName){
										case: 'title'
											title = xmlItems.childNodes[y].lastChild.nodeValue;
										case: 'link'
											link = xmlItems.childNodes[y].lastChild.nodeValue;
										case: 'pubDate'
											pubDate = xmlItems.childNodes[y].lastChild.nodeValue;
										case: 'creator'
											creator = xmlItems.childNodes[y].lastChild.nodeValue;
										case: 'description'
											description = xmlItems.childNodes[y].lastChild.nodeValue;
									}
									
									//Validate ALL fields are present (Assumption: All fields will always be present)
									if ((title !== false && title !== '') && (link !== false && link !== '') && (pubDate !== false && pubDate !== '') && (creator !== false && creator !== '') && (description !== false && description !== '')) {
									
										//Write content to page
										appendFeedItem(title, link, pubDate, creator, description);
										
										//Increment Count
										count++;
										
										//Reset Local variables
										title = false;
										link = false;
										pubDate = false;
										creator = false;
										description = false;
										
									}else{
									
										//One of the fields was not present
										debugError('One of the RSS Fields was empty, this item was not appended to the page!');
									}
								}	
							}		
						}
					}
				});					
			}

			//Append RSS item to the defined HTML element
			function appendFeedItem(title, link, pubDate, creator, description) {

				//Append RSS item
				$(elementID).append('<div id="' + settings.dom.itemID + '"><' + opts.titleTag + '>' + opts.titleText + '</' + opts.titleTag + '><div id="' + settings.dom.titleID + '"><a href="' + link + '">' + title + '</a></div><div id="' + settings.dom.descriptionID + '">' + description + '</div><div id="' + settings.dom.creatorID + '">' + creator + '</div><div id="' + settings.dom.publishDateID + '">' + pubDate + '</div></div>');
			}
		}
		
		// Plugin defaults - added as a property on our plugin function
		$.fn.rssReader.defaults = {			
			feedUrl: '',
			feedType: 'xml',
			debugMode: true,
			titleText: 'Latest',
			titleTag: 'h1'
		};	
	};  
})(jQuery);  