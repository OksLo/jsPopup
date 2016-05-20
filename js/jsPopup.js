function addEvent (selector, eventType, handler) {

	var targetScope = [];

	selector.forEach(function (selectorItem, index, array) {

		selectorItem = (typeof selectorItem === 'string') ? document.querySelectorAll(selectorItem) : selectorItem;

		if (selectorItem.length) {
			selectorItem = [].slice.call(selectorItem);
			targetScope = targetScope.concat(selectorItem);
		} else {
			targetScope.push(selectorItem);
		}
	});

	targetScope.forEach(function (elem) {
		elem.addEventListener(eventType, handler);
	});
};


var popup = new Popup({ Fog: 'fog', Box: 'box', NextBtn:'next-btn', PrevBtn: 'prev-btn', CloseBtn: 'close-btn'}, ['.link-popup']);


function Popup (pProps, pTarget) {

	var self = this,
		currentImage,
		imageNodes = document.querySelectorAll('a[href*=jpg]');

	for (prop in pProps) {
		this[prop] = document.createElement('div');
		this[prop].className = 'popup-' + pProps[prop];
	}

	function openImage (src) {

		console.log(self.NextBtn.parentElement);
		self.Fog.appendChild(self.NextBtn);
		self.Fog.appendChild(self.PrevBtn);

		var pImg = document.createElement('img');
			pImg.src = src;
			self.Box.appendChild(pImg);
	};

	this.openPopup = function (e) {

		e.preventDefault();
		e.stopPropagation();

		self.Fog.style.display = "block";
		self.Box.innerHTML= "";

		if (e.currentTarget.hash) {
			self.Box.appendChild(document.getElementById(e.currentTarget.hash.substr(1)).cloneNode(true));
		} else {

			openImage(e.currentTarget.href);
			currentImage = e.currentTarget;
		};
	};

	this.closePopup = function (e) {

		var parent = e.target.parentElement,
			clickOutside = true;

		if ((e.target == popup.NextBtn) || (e.target == popup.PrevBtn)) {
			return;
		};

		while (parent != document.body) {
			if (parent == popup.Box) {
				clickOutside = false;
				break;
			};
			parent = parent.parentElement;
		}

		if (clickOutside) {
			popup.Fog.style.display = "none";
		};

		if (self.NextBtn.parentElement) {
			self.Fog.removeChild(self.NextBtn);
			self.Fog.removeChild(self.PrevBtn);
		};		

	}

	this.leafImages = function (e) {
		var currentIndex;

		currentIndex = [].indexOf.call(imageNodes, currentImage);

		if (this == popup.NextBtn) {

			currentImage = (currentIndex == imageNodes.length-1) ? imageNodes[0] : imageNodes[currentIndex + 1];
		}

		if (this == popup.PrevBtn) {

			currentImage = (currentIndex == 0) ?  imageNodes[imageNodes.length-1] : imageNodes[currentIndex - 1];
		}

		popup.Box.innerHTML= "";
		openImage(currentImage.href);

	};

	document.body.appendChild(self.Fog);
	self.Fog.appendChild(self.Box);
	self.Fog.appendChild(self.CloseBtn);

	addEvent(['body', this.CloseBtn], 'click', self.closePopup);
	addEvent([this.NextBtn, this.PrevBtn], 'click', self.leafImages);

	addEvent(['a[href$=jpg]'].concat(pTarget), 'click', function (e) {popup.openPopup(e)});
}




