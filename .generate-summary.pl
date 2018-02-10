#!/usr/bin/env perl -n

BEGIN {
  print "# Summary\n\n"
}

# Trim whitespace
s/^\s+|\s+$//g;

# Print headlines
if (/^# (.*)/) {
  print "* [$1]($ARGV)\n"
}

# Print subheadlines
if (/^## (.*)/) {
  my $subheadline = $1;
  my $anchor = lc $subheadline;

  # Remove all but word characters and whitespace
  $anchor =~ s/[^\wö ]//g;
  # Replace whitespace with dashes
  $anchor =~ tr/ /-/d;

  print "  * [$subheadline]($ARGV#$anchor)\n"
}
